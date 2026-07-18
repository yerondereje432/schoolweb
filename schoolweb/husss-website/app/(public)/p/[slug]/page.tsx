import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";
import { ArrowLeft } from "lucide-react";

type Block = {
  id: string;
  block_type: string;
  sort_order: number;
  content: Record<string, unknown>;
};

export default async function CustomPageRenderer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("custom_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!page) notFound();

  const { data: blocks } = await supabase
    .from("custom_page_blocks")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order");

  return (
    <div className="relative">
      <GreenGeometric count={8} className="opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <StaggeredReveal staggerDelay={100}>
          <ScrollReveal3D type="slide-up-3d">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-husss-green-700 hover:underline mb-6"
            >
              <ArrowLeft size={14} /> Home
            </Link>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={100}>
            <h1 className="text-2xl md:text-3xl font-bold text-husss-green-950 mb-8">
              {page.title_en}
            </h1>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" delay={150}>
            <div className="space-y-8">
              {(blocks as Block[] | null || []).map((block, index) => (
                <ScrollReveal3D key={block.id} type="fade-up" delay={index * 80}>
                  <BlockRenderer block={block} />
                </ScrollReveal3D>
              ))}
            </div>
          </ScrollReveal3D>
        </StaggeredReveal>
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  const c = block.content as Record<string, string | string[] | { value: string; label: string }[]>;

  switch (block.block_type) {
    case "rich_text":
      return (
        <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
          {c.heading && (
            <h2 className="text-xl font-semibold text-husss-green-950 mb-2">
              {c.heading as string}
            </h2>
          )}
          {c.text && (
            <p className="whitespace-pre-line">{c.text as string}</p>
          )}
        </div>
      );

    case "image":
      return c.image_url ? (
        <ParallaxCard
          className="rounded-xl overflow-hidden p-0 hover:shadow-xl transition-all duration-500"
          glow
          glowColor="rgba(30, 123, 52, 0.2)"
          maxTilt={6}
        >
          <figure>
            <img
              src={c.image_url as string}
              alt={(c.caption as string) || ""}
              className="w-full"
            />
            {c.caption && (
              <figcaption className="text-sm text-gray-400 mt-2 text-center px-4 pb-4">
                {c.caption as string}
              </figcaption>
            )}
          </figure>
        </ParallaxCard>
      ) : null;

    case "image_gallery": {
      const images = (c.images as string[]) || [];
      if (images.length === 0) return null;
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <ParallaxCard
              key={i}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 p-0 hover:shadow-xl transition-all duration-500"
              glow
              glowColor="rgba(245, 168, 0, 0.25)"
              maxTilt={8}
            >
              <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </ParallaxCard>
          ))}
        </div>
      );
    }

    case "stats_grid": {
      const items = (c.items as { value: string; label: string }[]) || [];
      if (items.length === 0) return null;
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <ParallaxCard
              key={i}
              className="bg-husss-green-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-500"
              glow
              glowColor="rgba(30, 123, 52, 0.15)"
              maxTilt={6}
            >
              <p className="text-2xl font-bold text-husss-green-700">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </ParallaxCard>
          ))}
        </div>
      );
    }

    case "cta_button":
      return c.text && c.link ? (
        <div className="text-center">
          <a
            href={c.link as string}
            className="inline-block bg-husss-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-husss-green-700 transition-colors transform hover:scale-105"
          >
            {c.text as string}
          </a>
        </div>
      ) : null;

    case "video_embed":
      return c.video_url ? (
        <ParallaxCard
          className="aspect-video rounded-xl overflow-hidden bg-black p-0 hover:shadow-xl transition-all duration-500"
          glow
          glowColor="rgba(30, 123, 52, 0.2)"
          maxTilt={6}
        >
          <iframe
            src={c.video_url as string}
            className="w-full h-full"
            allowFullScreen
            title="Video"
          />
        </ParallaxCard>
      ) : null;

    default:
      return null;
  }
}
