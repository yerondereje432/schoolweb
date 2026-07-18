"use client";

import { useMemo, useState, useTransition } from "react";
import {
  upsertTopStudent,
  deleteTopStudent,
  type TopStudent,
} from "@/lib/actions/top-students";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, X, Medal } from "lucide-react";

const STREAMS = [
  { value: "natural_science", label: "Natural Science" },
  { value: "social_science", label: "Social Science" },
];

function emptyForm(year: number, rank: number): Partial<TopStudent> {
  return {
    exam_year: year,
    rank,
    full_name: "",
    stream: "natural_science",
    score: "",
    photo_url: null,
    quote_en: "",
  };
}

export default function TopStudentsClient({
  initialData,
}: {
  initialData: TopStudent[];
}) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Partial<TopStudent> | null>(null);
  const [newYearInput, setNewYearInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const years = useMemo(() => {
    const set = new Set(items.map((i) => i.exam_year));
    if (set.size === 0) set.add(2024);
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  function handleSave() {
    if (!editing?.full_name || !editing.exam_year || !editing.rank) return;
    startTransition(async () => {
      const result = await upsertTopStudent(editing);
      if (!result.error) {
        setEditing(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this student?")) return;
    startTransition(async () => {
      await deleteTopStudent(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  function addYear() {
    const year = Number(newYearInput);
    if (!year || years.includes(year)) return;
    setNewYearInput("");
    // Just triggers a re-render showing the empty slots; actual rows
    // are created on save.
    setItems((prev) => [...prev]);
    setYearsOverride((prev) => [...prev, year]);
  }

  const [yearsOverride, setYearsOverride] = useState<number[]>([]);
  const allYears = useMemo(
    () => Array.from(new Set([...years, ...yearsOverride])).sort((a, b) => b - a),
    [years, yearsOverride]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="number"
          placeholder="e.g. 2026"
          value={newYearInput}
          onChange={(e) => setNewYearInput(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-32"
        />
        <button
          onClick={addYear}
          className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700"
        >
          <Plus size={16} /> Add Exam Year
        </button>
      </div>

      {allYears.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
            {year} / {year + 1} EUEE Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((rank) => {
              const student = items.find(
                (i) => i.exam_year === year && i.rank === rank
              );
              return (
                <div
                  key={rank}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Medal
                      size={14}
                      className={
                        rank === 1
                          ? "text-husss-gold-500"
                          : rank === 2
                          ? "text-gray-400"
                          : "text-amber-700"
                      }
                    />
                    <span className="text-xs font-medium text-gray-500">
                      Rank {rank}
                    </span>
                  </div>

                  {student ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden mb-2">
                        {student.photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={student.photo_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="font-medium text-husss-green-950 text-sm">
                        {student.full_name}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {STREAMS.find((s) => s.value === student.stream)?.label}
                        {student.score ? ` · ${student.score}` : ""}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing({ ...student })}
                          className="text-xs text-husss-green-700 flex items-center gap-1"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-xs text-red-600 flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(emptyForm(year, rank))}
                      className="text-xs text-husss-green-700 border border-dashed border-husss-green-300 rounded-lg w-full py-4 hover:bg-husss-green-50"
                    >
                      + Add student
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                {editing.exam_year} — Rank {editing.rank}
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploader
                folder="top-students"
                value={editing.photo_url}
                onChange={(url) => setEditing({ ...editing, photo_url: url })}
                aspect="aspect-square"
              />

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Full name *
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Student full name"
                  value={editing.full_name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, full_name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Stream
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.stream || "natural_science"}
                    onChange={(e) =>
                      setEditing({ ...editing, stream: e.target.value })
                    }
                  >
                    {STREAMS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Score
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. 3.98 or 590/600"
                    value={editing.score || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, score: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Short quote (English, optional)
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.quote_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, quote_en: e.target.value })
                  }
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
                disabled={isPending || !editing.full_name}
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
