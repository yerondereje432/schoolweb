"use client";

import { useState, useTransition } from "react";
import {
  upsertAccomplishment,
  deleteAccomplishment,
  type Accomplishment,
} from "@/lib/actions/accomplishments";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

const CATEGORIES = [
  { value: "award", label: "Award" },
  { value: "exam_result", label: "Exam Result" },
  { value: "ranking", label: "Ranking" },
  { value: "recognition", label: "Recognition" },
];

const emptyForm: Partial<Accomplishment> = {
  title_en: "",
  title_om: "",
  title_am: "",
  description_en: "",
  description_om: "",
  description_am: "",
  category: "award",
  stat_value: "",
  stat_label_en: "",
  year: new Date().getFullYear(),
  image_url: null,
  is_featured: false,
};

export default function AccomplishmentsClient({
  initialData,
}: {
  initialData: Accomplishment[];
}) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Partial<Accomplishment> | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditing({ ...emptyForm });
  }

  function openEdit(item: Accomplishment) {
    setEditing({ ...item });
  }

  function handleSave() {
    if (!editing?.title_en) return;
    startTransition(async () => {
      const result = await upsertAccomplishment(editing);
      if (!result.error) {
        setEditing(null);
        // Simple refresh approach: reload from server via location refresh
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this accomplishment? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteAccomplishment(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  return (
    <div>
      <button
        onClick={openNew}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> Add Accomplishment
      </button>

      <div className="grid gap-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No accomplishments yet. Add the school&apos;s first award or exam
            result above.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
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
              <div className="flex items-center gap-2">
                <p className="font-medium text-husss-green-950 truncate">
                  {item.title_en}
                </p>
                {item.is_featured && (
                  <Star size={14} className="text-husss-gold-500 shrink-0" fill="currentColor" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {CATEGORIES.find((c) => c.value === item.category)?.label}
                {item.year ? ` · ${item.year}` : ""}
                {item.stat_value ? ` · ${item.stat_value}` : ""}
              </p>
            </div>

            <button
              onClick={() => openEdit(item)}
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
                {editing.id ? "Edit" : "New"} Accomplishment
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploader
                folder="accomplishments"
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
                  Description (English)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.description_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description_en: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.year || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, year: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Stat value (e.g. &quot;98%&quot;)
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.stat_value || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, stat_value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Stat label (e.g. &quot;Pass rate&quot;)
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.stat_label_en || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, stat_label_en: e.target.value })
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-husss-green-900">
                <input
                  type="checkbox"
                  checked={!!editing.is_featured}
                  onChange={(e) =>
                    setEditing({ ...editing, is_featured: e.target.checked })
                  }
                />
                Feature on homepage
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
