"use client";

import { useState, useTransition } from "react";
import {
  upsertAlbum,
  deleteAlbum,
  addImageToAlbum,
  deleteImage,
  type GalleryAlbum,
  type GalleryImage,
} from "@/lib/actions/gallery";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Trash2, X, FolderOpen, Pencil } from "lucide-react";

export default function GalleryClient({
  initialAlbums,
  initialImages,
}: {
  initialAlbums: GalleryAlbum[];
  initialImages: GalleryImage[];
}) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [images, setImages] = useState(initialImages);
  const [activeAlbum, setActiveAlbum] = useState<string | null>(
    initialAlbums[0]?.id || null
  );
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [editingAlbum, setEditingAlbum] = useState<Partial<GalleryAlbum> | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function createAlbum() {
    if (!newAlbumTitle.trim()) return;
    startTransition(async () => {
      const result = await upsertAlbum({ title_en: newAlbumTitle.trim() });
      if (result.album) {
        setAlbums((prev) => [...prev, result.album as GalleryAlbum]);
        setActiveAlbum(result.album.id);
      }
      setNewAlbumTitle("");
    });
  }

  function removeAlbum(id: string) {
    if (
      !confirm(
        "Delete this album and all its photos? This cannot be undone."
      )
    )
      return;
    startTransition(async () => {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      setImages((prev) => prev.filter((i) => i.album_id !== id));
      if (activeAlbum === id) setActiveAlbum(null);
    });
  }

  function handleUploadedImage(url: string | null) {
    if (!url || !activeAlbum) return;
    startTransition(async () => {
      await addImageToAlbum(activeAlbum, url);
      setImages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          album_id: activeAlbum,
          image_url: url,
          caption_en: null,
          sort_order: 0,
        },
      ]);
    });
  }

  function removeImage(id: string) {
    startTransition(async () => {
      await deleteImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    });
  }

  const activeImages = images.filter((i) => i.album_id === activeAlbum);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      {/* Albums sidebar */}
      <div>
        <div className="flex gap-2 mb-3">
          <input
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            placeholder="New album name"
            className="flex-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm"
          />
          <button
            onClick={createAlbum}
            className="rounded-lg bg-husss-green-600 text-white px-2.5 py-1.5"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {albums.map((album) => (
            <div
              key={album.id}
              className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm cursor-pointer ${
                activeAlbum === album.id
                  ? "bg-husss-green-600 text-white"
                  : "text-husss-green-900 hover:bg-husss-green-50"
              }`}
              onClick={() => setActiveAlbum(album.id)}
            >
              <FolderOpen size={14} className="shrink-0" />
              <span className="flex-1 truncate">{album.title_en}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAlbum(album.id);
                }}
                className={`opacity-0 group-hover:opacity-100 ${
                  activeAlbum === album.id ? "text-white" : "text-gray-400"
                }`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {albums.length === 0 && (
            <p className="text-xs text-gray-400 italic px-1">
              Create your first album above.
            </p>
          )}
        </div>
      </div>

      {/* Active album images */}
      <div>
        {activeAlbum ? (
          <>
            <div className="mb-4">
              <ImageUploader
                folder={`gallery/${activeAlbum}`}
                value={null}
                onChange={handleUploadedImage}
                label="Add photo to this album"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {activeImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {activeImages.length === 0 && (
                <p className="text-sm text-gray-400 italic col-span-full">
                  No photos in this album yet.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Select or create an album to add photos.
          </p>
        )}
      </div>
    </div>
  );
}
