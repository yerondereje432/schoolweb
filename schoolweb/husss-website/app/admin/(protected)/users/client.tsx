"use client";

import { useState, useTransition } from "react";
import {
  inviteAdminUser,
  removeAdminUser,
  updateAdminRole,
  type AdminUserRow,
} from "@/lib/actions/admin-users";
import { Plus, Trash2, X, Shield } from "lucide-react";

export default function UsersClient({
  initialData,
  currentUserId,
}: {
  initialData: AdminUserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialData);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    role: "editor" as "super_admin" | "editor",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite() {
    setError(null);
    if (!form.email || !form.full_name) return;
    startTransition(async () => {
      const result = await inviteAdminUser(form);
      if (result.error) {
        setError(result.error);
      } else {
        setInviting(false);
        setForm({ email: "", full_name: "", role: "editor" });
        window.location.reload();
      }
    });
  }

  function handleRemove(id: string) {
    if (!confirm("Remove this admin's access?")) return;
    startTransition(async () => {
      await removeAdminUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    });
  }

  function handleRoleChange(id: string, role: "super_admin" | "editor") {
    startTransition(async () => {
      await updateAdminRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    });
  }

  return (
    <div>
      <button
        onClick={() => setInviting(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> Invite Admin
      </button>

      <div className="grid gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="w-9 h-9 rounded-full bg-husss-green-100 flex items-center justify-center text-husss-green-700">
              <Shield size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-husss-green-950 truncate">
                {u.full_name || u.email}
                {u.id === currentUserId && (
                  <span className="text-xs text-gray-400 ml-2">(you)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <select
              value={u.role}
              onChange={(e) =>
                handleRoleChange(
                  u.id,
                  e.target.value as "super_admin" | "editor"
                )
              }
              className="text-sm rounded-lg border border-gray-300 px-2 py-1.5"
            >
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
            {u.id !== currentUserId && (
              <button
                onClick={() => handleRemove(u.id)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {inviting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                Invite New Admin
              </h2>
              <button onClick={() => setInviting(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Full name
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Role
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as "super_admin" | "editor",
                    })
                  }
                >
                  <option value="editor">Editor</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <p className="text-xs text-gray-400">
                They&apos;ll receive an email invite to set their password and
                sign in.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setInviting(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={isPending || !form.email || !form.full_name}
                className="flex-1 rounded-lg bg-husss-green-600 text-white py-2 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
              >
                {isPending ? "Inviting…" : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
