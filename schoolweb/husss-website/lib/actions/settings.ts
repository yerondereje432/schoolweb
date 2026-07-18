"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SiteSettings = {
  school_name_en: string;
  school_name_om: string;
  school_name_am: string;
  short_name: string;
  footer_text_en: string | null;
  footer_text_om: string | null;
  footer_text_am: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
};

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
