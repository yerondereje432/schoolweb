"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type HeroBanner = {
  id: string;
  title_en: string;
  title_om: string | null;
  title_am: string | null;
  subtitle_en: string | null;
  subtitle_om: string | null;
  subtitle_am: string | null;
  image_url: string | null;
  cta_text_en: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function upsertHeroBanner(data: Partial<HeroBanner>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { error } = id
    ? await supabase.from("hero_banners").update(rest).eq("id", id)
    : await supabase.from("hero_banners").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHeroBanner(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_banners").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { success: true };
}
