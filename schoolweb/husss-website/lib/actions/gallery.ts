"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type GalleryAlbum = {
  id: string;
  title_en: string;
  title_om: string | null;
  title_am: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  album_id: string;
  image_url: string;
  caption_en: string | null;
  sort_order: number;
};

export async function upsertAlbum(data: Partial<GalleryAlbum>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { data: row, error } = id
    ? await supabase.from("gallery_albums").update(rest).eq("id", id).select().single()
    : await supabase.from("gallery_albums").insert(rest).select().single();

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true, album: row };
}

export async function deleteAlbum(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function addImageToAlbum(albumId: string, imageUrl: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_images")
    .insert({ album_id: albumId, image_url: imageUrl });

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteImage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
