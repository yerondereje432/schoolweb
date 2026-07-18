import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./client";

export default async function GalleryAdminPage() {
  const supabase = await createClient();
  const [{ data: albums }, { data: images }] = await Promise.all([
    supabase.from("gallery_albums").select("*").order("sort_order"),
    supabase.from("gallery_images").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Student Gallery
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Organize student photos into albums (e.g. &quot;Graduation
        2025&quot;, &quot;Computer Lab&quot;, &quot;Sports Day&quot;). Only
        upload photos you have permission to publish.
      </p>

      <GalleryClient
        initialAlbums={albums || []}
        initialImages={images || []}
      />
    </div>
  );
}
