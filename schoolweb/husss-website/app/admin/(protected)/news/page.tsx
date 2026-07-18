import { createClient } from "@/lib/supabase/server";
import NewsClient from "./client";

export default async function NewsAdminPage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase
      .from("news_posts")
      .select("*")
      .order("published_at", { ascending: false }),
    supabase.from("news_categories").select("*").order("name_en"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        News & Announcements
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Publish news, events, and announcements. Each post appears on the
        public News page and can be featured on the homepage.
      </p>

      <NewsClient
        initialPosts={posts || []}
        initialCategories={categories || []}
      />
    </div>
  );
}
