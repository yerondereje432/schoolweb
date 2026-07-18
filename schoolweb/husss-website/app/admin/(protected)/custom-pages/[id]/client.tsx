"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  upsertCustomPage,
  addBlock,
  updateBlockContent,
  deleteBlock,
  reorderBlocks,
  type CustomPage,
  type CustomPageBlock,
  type BlockType,
} from "@/lib/actions/custom-pages";
import ImageUploader from "@/components/admin/image-uploader";
import {
  ArrowLeft,
  Check,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Images,
  BarChart3,
  MousePointerClick,
  Video,
  Plus,
} from "lucide-react";

const BLOCK_TYPES: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: "rich_text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "image_gallery", label: "Image Gallery", icon: Images },
  { type: "stats_grid", label: "Stats Grid", icon: BarChart3 },
  { type: "cta_button", label: "Button", icon: MousePointerClick },
  { type: "video_embed", label: "Video Embed", icon: Video },
];

export default function BlockEditorClient({
  page,
  initialBlocks,
}: {
  page: CustomPage;
  initialBlocks: CustomPageBlock[];
}) {
  const [pageData, setPageData] = useState(page);
  const [blocks, setBlocks] = useState(
    [...initialBlocks].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [isPending, startTransition] = useTransition();
  const [savedPage, setSavedPage] = useState(false);

  function savePageMeta() {
    startTransition(async () => {
      const result = await upsertCustomPage(pageData);
      if (!result.error) {
        setSavedPage(true);
        setTimeout(() => setSavedPage(false), 1500);
      }
    });
  }

  function handleAddBlock(type: BlockType) {
    startTransition(async () => {
      const result = await addBlock(page.id, type, blocks.length);
      if (result.block) {
        setBlocks((prev) => [...prev, result.block as CustomPageBlock]);
      }
    });
  }

  function handleUpdateBlock(id: string, content: Record<string, unknown>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );
    startTransition(async () => {
      await updateBlockContent(id, content);
    });
  }

  function handleDeleteBlock(id: string) {
    if (!confirm("Remove this block?")) return;
    startTransition(async () => {
      await deleteBlock(id);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    });
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [
      newBlocks[newIndex],
      newBlocks[index],
    ];
    setBlocks(newBlocks);
    startTransition(async () => {
      await reorderBlocks(
        newBlocks.map((b, i) => ({ id: b.id, sort_order: i }))
      );
    });
  }

  return (
    <div>
      <Link
        href="/admin/custom-pages"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-husss-green-700 mb-4"
      >
        <ArrowLeft size={14} /> Back to Custom Pages
      </Link>

      {/* Page settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-husss-green-900 mb-4">
          Page Settings
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={pageData.title_en}
              onChange={(e) =>
                setPageData({ ...pageData, title_en: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-husss-green-900 mb-1">
              URL slug
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500">
              /p/{pageData.slug}
            </div>
          </div>
        </div>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 text-sm text-husss-green-900">
            <input
              type="checkbox"
              checked={pageData.is_published}
              onChange={(e) =>
                setPageData({ ...pageData, is_published: e.target.checked })
              }
            />
            Published (visible to the public)
          </label>
          <label className="flex items-center gap-2 text-sm text-husss-green-900">
            <input
              type="checkbox"
              checked={pageData.show_in_nav}
              onChange={(e) =>
                setPageData({ ...pageData, show_in_nav: e.target.checked })
              }
            />
            Show in navigation menu
          </label>
        </div>
        <button
          onClick={savePageMeta}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-husss-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-husss-green-700 disabled:opacity-60"
        >
          {savedPage ? (
            <>
              <Check size={14} /> Saved
            </>
          ) : (
            "Save Page Settings"
          )}
        </button>
      </div>

      {/* Blocks */}
      <h2 className="text-sm font-semibold text-husss-green-900 mb-3">
        Page Content
      </h2>

      <div className="space-y-3 mb-6">
        {blocks.map((block, index) => (
          <BlockCard
            key={block.id}
            block={block}
            onUpdate={(content) => handleUpdateBlock(block.id, content)}
            onDelete={() => handleDeleteBlock(block.id)}
            onMoveUp={index > 0 ? () => moveBlock(index, -1) : undefined}
            onMoveDown={
              index < blocks.length - 1 ? () => moveBlock(index, 1) : undefined
            }
          />
        ))}
        {blocks.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No content yet. Add a block below to start building this page.
          </p>
        )}
      </div>

      <div className="bg-husss-green-50 border border-husss-green-100 rounded-xl p-4">
        <p className="text-xs font-medium text-husss-green-900 mb-3">
          Add a block
        </p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              onClick={() => handleAddBlock(bt.type)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-husss-green-200 px-3 py-2 text-xs font-medium text-husss-green-800 hover:bg-husss-green-100"
            >
              <bt.icon size={14} /> {bt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockCard({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: CustomPageBlock;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const typeInfo = BLOCK_TYPES.find((b) => b.type === block.block_type)!;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <typeInfo.icon size={13} /> {typeInfo.label}
        </span>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button onClick={onMoveUp} className="p-1 text-gray-400 hover:text-husss-green-600">
              <ChevronUp size={15} />
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="p-1 text-gray-400 hover:text-husss-green-600">
              <ChevronDown size={15} />
            </button>
          )}
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <BlockEditor block={block} onUpdate={onUpdate} />
    </div>
  );
}

function BlockEditor({
  block,
  onUpdate,
}: {
  block: CustomPageBlock;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const c = block.content as Record<string, string>;

  switch (block.block_type) {
    case "rich_text":
      return (
        <div className="space-y-2">
          <input
            placeholder="Heading (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
            defaultValue={c.heading || ""}
            onBlur={(e) => onUpdate({ ...c, heading: e.target.value })}
          />
          <textarea
            placeholder="Write your content…"
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            defaultValue={c.text || ""}
            onBlur={(e) => onUpdate({ ...c, text: e.target.value })}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <ImageUploader
            folder="custom-pages"
            value={c.image_url || null}
            onChange={(url) => onUpdate({ ...c, image_url: url })}
          />
          <input
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            defaultValue={c.caption || ""}
            onBlur={(e) => onUpdate({ ...c, caption: e.target.value })}
          />
        </div>
      );

    case "image_gallery":
      return <ImageGalleryBlockEditor content={c} onUpdate={onUpdate} />;

    case "stats_grid":
      return <StatsGridBlockEditor content={c} onUpdate={onUpdate} />;

    case "cta_button":
      return (
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Button text"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            defaultValue={c.text || ""}
            onBlur={(e) => onUpdate({ ...c, text: e.target.value })}
          />
          <input
            placeholder="Link URL"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            defaultValue={c.link || ""}
            onBlur={(e) => onUpdate({ ...c, link: e.target.value })}
          />
        </div>
      );

    case "video_embed":
      return (
        <input
          placeholder="YouTube or video embed URL"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          defaultValue={c.video_url || ""}
          onBlur={(e) => onUpdate({ ...c, video_url: e.target.value })}
        />
      );

    default:
      return null;
  }
}

function ImageGalleryBlockEditor({
  content,
  onUpdate,
}: {
  content: Record<string, unknown>;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const images = (content.images as string[]) || [];

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() =>
                onUpdate({
                  ...content,
                  images: images.filter((_, idx) => idx !== i),
                })
              }
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
      <ImageUploader
        folder="custom-pages/gallery"
        value={null}
        onChange={(url) => {
          if (url) onUpdate({ ...content, images: [...images, url] });
        }}
        label="Add image to gallery"
      />
    </div>
  );
}

function StatsGridBlockEditor({
  content,
  onUpdate,
}: {
  content: Record<string, unknown>;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const items =
    (content.items as { value: string; label: string }[]) || [];

  function updateItem(index: number, field: "value" | "label", val: string) {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    onUpdate({ ...content, items: next });
  }

  return (
    <div>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Value (e.g. 98%)"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              defaultValue={item.value}
              onBlur={(e) => updateItem(i, "value", e.target.value)}
            />
            <input
              placeholder="Label (e.g. Pass rate)"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              defaultValue={item.label}
              onBlur={(e) => updateItem(i, "label", e.target.value)}
            />
            <button
              onClick={() =>
                onUpdate({
                  ...content,
                  items: items.filter((_, idx) => idx !== i),
                })
              }
              className="text-gray-400 hover:text-red-600 px-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          onUpdate({ ...content, items: [...items, { value: "", label: "" }] })
        }
        className="inline-flex items-center gap-1 text-xs text-husss-green-700"
      >
        <Plus size={13} /> Add stat
      </button>
    </div>
  );
}
