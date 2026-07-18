"use client";

import { useState, useTransition } from "react";
import {
  upsertStaffMember,
  deleteStaffMember,
  type StaffMember,
} from "@/lib/actions/staff";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, X, Crown } from "lucide-react";

const emptyForm: Partial<StaffMember> = {
  full_name: "",
  role_en: "",
  role_om: "",
  role_am: "",
  bio_en: "",
  photo_url: null,
  department: "",
  is_leadership: false,
  sort_order: 0,
};

export default function StaffClient({
  initialData,
}: {
  initialData: StaffMember[];
}) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Partial<StaffMember> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!editing?.full_name || !editing.role_en) return;
    startTransition(async () => {
      const result = await upsertStaffMember(editing);
      if (!result.error) {
        setEditing(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this staff member?")) return;
    startTransition(async () => {
      await deleteStaffMember(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  const leadership = items.filter((i) => i.is_leadership);
  const others = items.filter((i) => !i.is_leadership);

  return (
    <div>
      <button
        onClick={() => setEditing({ ...emptyForm })}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> Add Staff Member
      </button>

      {[
        { title: "Leadership", data: leadership },
        { title: "Teachers & Staff", data: others },
      ].map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
            {group.title}
          </h2>
          {group.data.length === 0 ? (
            <p className="text-sm text-gray-400 italic">None added yet.</p>
          ) : (
            <div className="grid gap-3">
              {group.data.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    {item.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.photo_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-husss-green-950 truncate">
                        {item.full_name}
                      </p>
                      {item.is_leadership && (
                        <Crown size={13} className="text-husss-gold-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.role_en}</p>
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
          )}
        </div>
      ))}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                {editing.id ? "Edit" : "New"} Staff Member
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploader
                folder="staff"
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
                  value={editing.full_name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, full_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Role / Title (English) *
                </label>
                <input
                  placeholder="e.g. Director, Vice-Director, Mathematics Teacher"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.role_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, role_en: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Role (Afaan Oromo)
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.role_om || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, role_om: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Role (Amharic)
                  </label>
                  <input
                    lang="am"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={editing.role_am || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, role_am: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Short bio (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.bio_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, bio_en: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-husss-green-900">
                <input
                  type="checkbox"
                  checked={!!editing.is_leadership}
                  onChange={(e) =>
                    setEditing({ ...editing, is_leadership: e.target.checked })
                  }
                />
                Show in Leadership section (e.g. Director, Vice-Director)
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
                disabled={isPending || !editing.full_name || !editing.role_en}
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
