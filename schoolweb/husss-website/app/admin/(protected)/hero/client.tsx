"use client";

import { useState, useTransition } from "react";
import {
  upsertHeroBanner,
  deleteHeroBanner,
  type HeroBanner,
} from "@/lib/actions/hero";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const emptyForm: Partial<HeroBanner> = {
  title_en: "",
  title_om: "",
  title_am: "",
  subtitle_en: "",
  image_url: null,
  cta_text_en: "Explore HUSSS",
  cta_link: "/about",
  is_active: true,
  sort_order: 0,
};

export default function HeroClient({
  initialData,
}: {
  initialData: HeroBanner[];
}) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Partial<HeroBanner> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!editing?.title_en) return;
    startTransition(async () => {
      const result = await upsertHeroBanner(editing);
      if (!result.error) {
        setEditing(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this banner?")) return;
    startTransition(async () => {
      await deleteHeroBanner(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  return (
    <div>
      <button
        onClick={() => setEditing({ ...emptyForm })}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> Add Banner
      </button>

      <div className="grid gap-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No hero banner yet — the homepage will show a default placeholder
            until you add one.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="w-24 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-husss-green-950 truncate">
                {item.title_en}
              </p>
              <p className="text-xs text-gray-500">
                {item.is_active ? "Active" : "Hidden"}
              </p>
            </div>
            <button
              onClick={() => setEditing({ ...item })}
              className="p-2 text-gray-400 hover:text-husss-green-600"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                {editing.id ? "Edit" : "New"} Hero Banner
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploader
                folder="hero"
                value={editing.image_url}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                aspect="aspect-video"
              />

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Title (English) *
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.title_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, title_en: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Title (Afaan Oromo)
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.title_om || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, title_om: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Title (Amharic)
                  </label>
                  <input
                    lang="am"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.title_am || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, title_am: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.subtitle_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, subtitle_en: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Button text
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.cta_text_en || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, cta_text_en: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Button link
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.cta_link || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, cta_link: e.target.value })
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-husss-green-900">
                <input
                  type="checkbox"
                  checked={!!editing.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                />
                Active (visible on homepage)
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending || !editing.title_en}
                className="flex-1 rounded-lg bg-husss-green-600 text-white py-2 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
