import { createClient } from "@/lib/supabase/server";
import HomePageClient from "@/components/public/HomePageClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: banners },
    { data: featuredAccomplishments },
    { data: latestNews },
    { data: settings },
    { data: topStudents },
  ] = await Promise.all([
    supabase.from("hero_banners").select("*").eq("is_active", true).order("sort_order").limit(1),
    supabase.from("accomplishments").select("*").eq("is_featured", true).order("sort_order").limit(3),
    supabase.from("news_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("top_students").select("*").order("exam_year", { ascending: false }).order("rank").limit(3),
  ]);

  return (
    <HomePageClient
      hero={banners?.[0] || null}
      featuredAccomplishments={featuredAccomplishments}
      latestNews={latestNews}
      settings={settings}
      topStudents={topStudents}
    />
  );
}
