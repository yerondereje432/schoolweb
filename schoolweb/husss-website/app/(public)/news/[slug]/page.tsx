import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";

// Always render fresh from Supabase — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("news_posts")
    .select("*, news_categories(name_en)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="relative">
      <GreenGeometric count={8} className="opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <StaggeredReveal staggerDelay={100}>
          <ScrollReveal3D type="fade-up">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-husss-green-700 hover:underline mb-6"
            >
              <ArrowLeft size={14} /> Back to News
            </Link>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d">
            {post.cover_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6">
                <img
                  src={post.cover_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={100}>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" delay={150}>
            <h1 className="text-2xl md:text-3xl font-bold text-husss-green-950 mb-6">{post.title_en}</h1>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={200}>
            <ParallaxCard
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-lg transition-all duration-500"
              glow
              glowColor="rgba(30, 123, 52, 0.2)"
            >
              <div className="prose prose-green max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {post.body_en || post.excerpt_en || ""}
              </div>
            </ParallaxCard>
          </ScrollReveal3D>
        </StaggeredReveal>
      </div>
    </div>
  );
}
