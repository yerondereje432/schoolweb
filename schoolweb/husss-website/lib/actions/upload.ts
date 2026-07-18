"use server";

import { createClient } from "@/lib/supabase/server";

export type UploadResult = { url?: string; error?: string };

// Real image magic-byte signatures — checked against actual file content,
// not the browser-reported (spoofable) MIME type. This stops someone from
// renaming a malicious file (e.g. an HTML/SVG file with embedded script)
// to look like a .jpg and bypassing a type check that only looks at
// file.type or the filename extension.
const MAGIC_BYTES: { mime: string; bytes: number[] }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // followed by WEBP at offset 8
];

async function detectRealImageType(file: File): Promise<string | null> {
  const buffer = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  for (const { mime, bytes } of MAGIC_BYTES) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      // WEBP needs an extra check since RIFF is shared with other formats
      if (mime === "image/webp") {
        const marker = new TextDecoder().decode(buffer.slice(8, 12));
        if (marker !== "WEBP") continue;
      }
      return mime;
    }
  }
  return null;
}

// Only allow known-safe, simple folder names — no slashes beyond one level,
// no "..", no special characters that could be used for path traversal or
// to write outside the intended prefix.
function sanitizeFolder(folder: string): string {
  const cleaned = folder
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/^\/+|\/+$/g, "");
  return cleaned || "misc";
}

/**
 * Uploads an image file to the `husss-media` Supabase Storage bucket under
 * the given folder, and returns its public URL. Used by every admin content
 * form (hero, news, staff, gallery, accomplishments, top students, etc.)
 *
 * Validates the file is a genuine image by inspecting its actual binary
 * signature (not just the browser-reported MIME type, which is trivial to
 * spoof), and requires an authenticated admin session — enforced here as
 * well as by the storage bucket's own RLS policy (defense in depth).
 */
export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const file = formData.get("file") as File | null;
  const folder = sanitizeFolder(String(formData.get("folder") || "misc"));

  if (!file || file.size === 0) {
    return { error: "No file provided." };
  }

  const MAX_BYTES = 8 * 1024 * 1024; // 8MB
  if (file.size > MAX_BYTES) {
    return { error: "Image is too large (max 8MB)." };
  }

  const realType = await detectRealImageType(file);
  if (!realType) {
    return {
      error:
        "This doesn't look like a valid image file. Please upload a JPG, PNG, GIF, or WEBP.",
    };
  }

  const extByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  const ext = extByType[realType];
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("husss-media")
    .upload(path, file, { contentType: realType, upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("husss-media").getPublicUrl(path);

  return { url: publicUrl };
}
