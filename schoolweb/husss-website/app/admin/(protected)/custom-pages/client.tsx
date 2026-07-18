"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  upsertCustomPage,
  deleteCustomPage,
  type CustomPage,
} from "@/lib/actions/custom-pages";
import { Plus, Trash2, X, ExternalLink, Settings2 } from "lucide-react";

const emptyForm: Partial<CustomPage> = {
  title_en: "",
  is_published: false,
  show_in_nav: true,
  nav_order: 100,
};

export default function CustomPagesClient({
  initialPages,
}: {
  initialPages: CustomPage[];
}) {
  const [pages, setPages] = useState(initialPages);
  const [creating, setCreating] = useState<Partial<CustomPage> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!creating?.title_en) return;
    startTransition(async () => {
      const result = await upsertCustomPage(creating);
      if (result.page) {
        setPages((prev) => [...prev, result.page as CustomPage]);
        setCreating(null);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this entire page and all its content?")) return;
    startTransition(async () => {
      await deleteCustomPage(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
    });
  }

  return (
    <div>
      <button
        onClick={() => setCreating({ ...emptyForm })}
        className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 mb-6"
      >
        <Plus size={16} /> New Custom Page
      </button>

      <div className="grid gap-3">
        {pages.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No custom pages yet. Try creating &quot;Alumni&quot; or
            &quot;Events&quot; as your first one.
          </p>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-husss-green-950">
                {page.title_en}
              </p>
              <p className="text-xs text-gray-500">
                /p/{page.slug} ·{" "}
                {page.is_published ? "Published" : "Draft"}
                {page.show_in_nav ? " · In menu" : ""}
              </p>
            </div>
            {page.is_published && (
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                className="p-2 text-gray-400 hover:text-husss-green-600"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <Link
              href={`/admin/custom-pages/${page.id}`}
              className="p-2 text-gray-400 hover:text-husss-green-600"
            >
              <Settings2 size={16} />
            </Link>
            <button
              onClick={() => handleDelete(page.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {creating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                New Custom Page
              </h2>
              <button onClick={() => setCreating(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-husss-green-900 mb-1">
                Page title
              </label>
              <input
                placeholder="e.g. Alumni, Events, Downloads"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={creating.title_en || ""}
                onChange={(e) =>
                  setCreating({ ...creating, title_en: e.target.value })
                }
              />
              <p className="text-xs text-gray-400 mt-1.5">
                You&apos;ll add content and publish it on the next screen.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCreating(null)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending || !creating.title_en}
                className="flex-1 rounded-lg bg-husss-green-600 text-white py-2 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
              >
                {isPending ? "Creating…" : "Create & Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
