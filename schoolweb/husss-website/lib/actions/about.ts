"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AboutContent = {
  mission_en: string | null; mission_om: string | null; mission_am: string | null;
  vision_en: string | null; vision_om: string | null; vision_am: string | null;
  history_en: string | null; history_om: string | null; history_am: string | null;
  why_distinguished_en: string | null; why_distinguished_om: string | null; why_distinguished_am: string | null;
};

export async function updateAboutContent(data: Partial<AboutContent>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_content")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/about");
  revalidatePath("/about");
  revalidatePath("/");
  return { success: true };
}
