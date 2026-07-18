"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NewsPost = {
  id: string;
  slug: string;
  title_en: string;
  title_om: string | null;
  title_am: string | null;
  excerpt_en: string | null;
  excerpt_om: string | null;
  excerpt_am: string | null;
  body_en: string | null;
  body_om: string | null;
  body_am: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  published_at: string | null;
  is_published: boolean;
};

export type NewsCategory = {
  id: string;
  name_en: string;
  name_om: string | null;
  name_am: string | null;
  slug: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function upsertNewsPost(data: Partial<NewsPost>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  if (!rest.slug && rest.title_en) {
    rest.slug = `${slugify(rest.title_en)}-${Date.now().toString(36)}`;
  }

  const { error } = id
    ? await supabase.from("news_posts").update(rest).eq("id", id)
    : await supabase.from("news_posts").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  return { success: true };
}

export async function deleteNewsPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true };
}

export async function upsertNewsCategory(data: Partial<NewsCategory>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  if (!rest.slug && rest.name_en) {
    rest.slug = slugify(rest.name_en);
  }

  const { error } = id
    ? await supabase.from("news_categories").update(rest).eq("id", id)
    : await supabase.from("news_categories").insert(rest);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function deleteNewsCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("news_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}
