"use client";

import { useState, useTransition } from "react";
import {
  upsertNewsPost,
  deleteNewsPost,
  upsertNewsCategory,
  deleteNewsCategory,
  type NewsPost,
  type NewsCategory,
} from "@/lib/actions/news";
import ImageUploader from "@/components/admin/image-uploader";
import { Plus, Pencil, Trash2, X, Tag, Eye, EyeOff } from "lucide-react";

const emptyPost: Partial<NewsPost> = {
  title_en: "",
  title_om: "",
  title_am: "",
  excerpt_en: "",
  body_en: "",
  cover_image_url: null,
  category_id: null,
  is_published: true,
  published_at: new Date().toISOString().slice(0, 10),
};

export default function NewsClient({
  initialPosts,
  initialCategories,
}: {
  initialPosts: NewsPost[];
  initialCategories: NewsCategory[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!editing?.title_en) return;
    startTransition(async () => {
      const result = await upsertNewsPost(editing);
      if (!result.error) {
        setEditing(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this news post?")) return;
    startTransition(async () => {
      await deleteNewsPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function togglePublished(post: NewsPost) {
    startTransition(async () => {
      await upsertNewsPost({ id: post.id, is_published: !post.is_published });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_published: !p.is_published } : p
        )
      );
    });
  }

  function addCategory() {
    if (!newCategoryName.trim()) return;
    startTransition(async () => {
      await upsertNewsCategory({ name_en: newCategoryName.trim() });
      setNewCategoryName("");
      window.location.reload();
    });
  }

  function removeCategory(id: string) {
    if (!confirm("Delete this category? Posts using it will be uncategorized."))
      return;
    startTransition(async () => {
      await deleteNewsCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    });
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setEditing({ ...emptyPost })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700"
        >
          <Plus size={16} /> New Post
        </button>
        <button
          onClick={() => setShowCategoryPanel((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <Tag size={16} /> Manage Categories
        </button>
      </div>

      {showCategoryPanel && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <p className="text-sm font-medium text-husss-green-900 mb-3">
            Categories
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 bg-husss-green-50 text-husss-green-800 text-xs rounded-full px-3 py-1"
              >
                {c.name_en}
                <button onClick={() => removeCategory(c.id)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-gray-400 italic">No categories yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Academics, Events, Sports"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            />
            <button
              onClick={addCategory}
              className="rounded-lg bg-husss-green-600 text-white px-3 py-1.5 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {posts.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No news posts yet. Click &quot;New Post&quot; to publish the
            school&apos;s first announcement.
          </p>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-husss-green-950 truncate">
                {post.title_en}
              </p>
              <p className="text-xs text-gray-500">
                {post.published_at?.slice(0, 10)}
                {!post.is_published && (
                  <span className="ml-2 text-amber-600">Draft</span>
                )}
              </p>
            </div>
            <button
              onClick={() => togglePublished(post)}
              className="p-2 text-gray-400 hover:text-husss-green-600"
              title={post.is_published ? "Unpublish" : "Publish"}
            >
              {post.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => setEditing({ ...post })}
              className="p-2 text-gray-400 hover:text-husss-green-600"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-husss-green-950">
                {editing.id ? "Edit" : "New"} News Post
              </h2>
              <button onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUploader
                folder="news"
                value={editing.cover_image_url}
                onChange={(url) =>
                  setEditing({ ...editing, cover_image_url: url })
                }
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
                  Excerpt (short summary)
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.excerpt_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, excerpt_en: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-husss-green-900 mb-1">
                  Full article body (English)
                </label>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={editing.body_en || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, body_en: e.target.value })
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
                    value={editing.category_id || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category_id: e.target.value || null,
                      })
                    }
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-husss-green-900 mb-1">
                    Publish date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={
                      editing.published_at
                        ? editing.published_at.slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditing({ ...editing, published_at: e.target.value })
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-husss-green-900">
                <input
                  type="checkbox"
                  checked={!!editing.is_published}
                  onChange={(e) =>
                    setEditing({ ...editing, is_published: e.target.checked })
                  }
                />
                Published (visible on the public site)
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
