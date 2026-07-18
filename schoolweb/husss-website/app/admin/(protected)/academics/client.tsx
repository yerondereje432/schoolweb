"use client";

import { useState, useTransition } from "react";
import {
  upsertProgram,
  deleteProgram,
  type AcademicProgram,
} from "@/lib/actions/academics";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const GRADES = ["9", "10", "11", "12"];
const STREAMS = [
  { value: "", label: "General (no stream)" },
  { value: "natural_science", label: "Natural Science" },
  { value: "social_science", label: "Social Science" },
];

const emptyForm: Partial<AcademicProgram> = {
  grade_level: "9",
  stream: null,
  title_en: "",
  description_en: "",
  subjects_en: [],
  sort_order: 0,
};

export default function AcademicsClient({
  initialData,
}: {
  initialData: AcademicProgram[];
}) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Partial<AcademicProgram> | null>(
    null
  );
  const [subjectsInput, setSubjectsInput] = useState("");
  const [isPending, startTransition] = useTransition();

  function openEdit(item?: AcademicProgram) {
    const target = item || emptyForm;
    setEditing({ ...target });
    setSubjectsInput((target.subjects_en || []).join(", "));
  }

  function handleSave() {
    if (!editing?.title_en || !editing.grade_level) return;
    const subjects_en = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    startTransition(async () => {
      const result = await upsertProgram({ ...editing, subjects_en });
      if (!result.error) {
        setEditing(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this program entry?")) return;
    startTransition(async () => {
      await deleteProgram(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  return (
    <div>
      <button
        onClick={() => openEdit()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> Add Grade / Stream
      </button>

      <div className="grid gap-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No academic programs added yet.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="w-10 h-10 rounded-lg bg-husss-green-100 flex items-center justify-center text-husss-green-800 font-semibold text-sm shrink-0">
              G{item.grade_level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-husss-green-950 truncate">
                {item.title_en}
              </p>
              <p className="text-xs text-gray-500">
                {STREAMS.find((s) => s.value === (item.stream || ""))?.label}
                {item.subjects_en?.length
                  ? ` · ${item.subjects_en.length} subjects`
                  : ""}
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
                {editing.id ? "Edit" : "New"} Program Entry
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Grade level
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.grade_level}
                    onChange={(e) =>
                      setEditing({ ...editing, grade_level: e.target.value })
                    }
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Stream
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.stream || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        stream: e.target.value || null,
                      })
                    }
                  >
                    {STREAMS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Title *
                </label>
                <input
                  placeholder="e.g. Grade 9-10 General Program"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.title_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, title_en: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Description
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

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Subjects (comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mathematics, Physics, Chemistry, Biology, English..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={subjectsInput}
                  onChange={(e) => setSubjectsInput(e.target.value)}
                />
              </div>
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
