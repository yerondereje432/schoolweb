"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CustomPage = {
  id: string;
  slug: string;
  title_en: string;
  title_om: string | null;
  title_am: string | null;
  is_published: boolean;
  show_in_nav: boolean;
  nav_order: number;
};

export type BlockType =
  | "rich_text"
  | "image"
  | "image_gallery"
  | "stats_grid"
  | "cta_button"
  | "video_embed";

export type CustomPageBlock = {
  id: string;
  page_id: string;
  block_type: BlockType;
  sort_order: number;
  content: Record<string, unknown>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function upsertCustomPage(data: Partial<CustomPage>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  if (!rest.slug && rest.title_en) {
    rest.slug = slugify(rest.title_en);
  }

  const { data: row, error } = id
    ? await supabase
        .from("custom_pages")
        .update(rest)
        .eq("id", id)
        .select()
        .single()
    : await supabase.from("custom_pages").insert(rest).select().single();

  if (error) return { error: error.message };

  revalidatePath("/admin/custom-pages");
  revalidatePath(`/p/${row.slug}`);
  return { success: true, page: row as CustomPage };
}

export async function deleteCustomPage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("custom_pages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/custom-pages");
  return { success: true };
}

export async function addBlock(
  pageId: string,
  blockType: BlockType,
  sortOrder: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custom_page_blocks")
    .insert({
      page_id: pageId,
      block_type: blockType,
      sort_order: sortOrder,
      content: {},
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/custom-pages");
  return { success: true, block: data as CustomPageBlock };
}

export async function updateBlockContent(
  id: string,
  content: Record<string, unknown>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_page_blocks")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/custom-pages");
  return { success: true };
}

export async function deleteBlock(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_page_blocks")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/custom-pages");
  return { success: true };
}

export async function reorderBlocks(
  updates: { id: string; sort_order: number }[]
) {
  const supabase = await createClient();
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("custom_page_blocks").update({ sort_order }).eq("id", id)
    )
  );
  revalidatePath("/admin/custom-pages");
  return { success: true };
}
