import Link from "next/link";
import PageHero from "@/components/public/page-hero";
import { createClient } from "@/lib/supabase/server";
import { Newspaper } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";

// Always render fresh from Supabase — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function NewsListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("news_posts")
    .select("*, news_categories(name_en)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="relative">
      <GreenGeometric count={10} className="opacity-20" />

      <PageHero
        icon={<Newspaper size={28} />}
        eyebrow="Bulletin"
        title="News & Announcements"
        subtitle="Stay up to date with what's happening at HUSSS."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        {(!posts || posts.length === 0) && (
          <ScrollReveal3D type="fade-up">
            <div className="text-center py-16">
              <Newspaper className="mx-auto text-husss-green-300 mb-4" size={48} />
              <p className="text-gray-400 italic text-lg">
                No news posted yet. Check back soon.
              </p>
            </div>
          </ScrollReveal3D>
        )}

        <StaggeredReveal staggerDelay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(posts || []).map((post, index) => (
              <ScrollReveal3D key={post.id} type="slide-up-3d" delay={index * 80}>
                <Link
                  href={"/news/" + post.slug}
                  className="block"
                >
                  <ParallaxCard
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 h-full"
                    glow
                    glowColor="rgba(245, 168, 0, 0.25)"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {post.cover_image_url && (
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : ""}
                        </span>
                        {post.news_categories && (
                          <>
                            <span>·</span>
                            <span className="text-husss-gold-500 font-medium px-2 py-0.5 bg-husss-gold-100 rounded-full">
                              {(post.news_categories as { name_en: string }).name_en}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="font-semibold text-husss-green-950 leading-snug">{post.title_en}</p>
                      {post.excerpt_en && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt_en}</p>
                      )}
                    </div>
                  </ParallaxCard>
                </Link>
              </ScrollReveal3D>
            ))}
          </div>
        </StaggeredReveal>
      </div>
    </div>
  );
}
