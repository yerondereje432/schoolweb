import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Maximize } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: album }, { data: images }] = await Promise.all([
    supabase.from("gallery_albums").select("*").eq("id", id).single(),
    supabase.from("gallery_images").select("*").eq("album_id", id).order("sort_order"),
  ]);

  if (!album) notFound();

  return (
    <div className="relative">
      <GreenGeometric count={8} className="opacity-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <ScrollReveal3D type="fade-up">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm text-husss-green-700 hover:underline mb-6"
          >
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
        </ScrollReveal3D>

        <StaggeredReveal staggerDelay={100}>
          <ScrollReveal3D type="slide-up-3d">
            <h1 className="text-2xl md:text-3xl font-bold text-husss-green-950 mb-2">{album.title_en}</h1>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={100}>
            {album.description_en && (
              <p className="text-gray-500 mb-8 max-w-2xl">{album.description_en}</p>
            )}
          </ScrollReveal3D>

          {(!images || images.length === 0) && (
            <ScrollReveal3D type="fade-up" delay={200}>
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <Maximize className="mx-auto text-husss-green-300 mb-3" size={32} />
                <p className="text-gray-400 italic">No photos in this album yet.</p>
              </div>
            </ScrollReveal3D>
          )}

          <ScrollReveal3D type="slide-up-3d" delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(images || []).map((img, index) => (
                <ScrollReveal3D key={img.id} type="fade-up" delay={index * 30}>
                  <ParallaxCard
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 p-0 hover:shadow-xl transition-all duration-500"
                    glow
                    glowColor="rgba(245, 168, 0, 0.3)"
                    maxTilt={8}
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption_en || ""}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </ParallaxCard>
                </ScrollReveal3D>
              ))}
            </div>
          </ScrollReveal3D>
        </StaggeredReveal>
      </div>
    </div>
  );
}
