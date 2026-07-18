import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}

export async function getContactInfo() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .single();
  return data;
}

export async function getPublishedCustomPages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("custom_pages")
    .select("id, slug, title_en, nav_order")
    .eq("is_published", true)
    .eq("show_in_nav", true)
    .order("nav_order");
  return data || [];
}

export async function getActiveHeroBanner() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .limit(1);
  return data?.[0] || null;
}
