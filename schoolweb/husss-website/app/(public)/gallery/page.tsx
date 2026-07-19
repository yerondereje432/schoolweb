import Link from "next/link";
import PageHero from "@/components/public/page-hero";
import { createClient } from "@/lib/supabase/server";
import { Images } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: albums } = await supabase
    .from("gallery_albums")
    .select("*, gallery_images(count)")
    .order("sort_order");

  return (
    <div className="relative">
      <GreenGeometric count={12} className="opacity-25" />

      <PageHero
        icon={<Images size={28} />}
        eyebrow="Student Life"
        title="Student Life & Gallery"
        subtitle="Discover life at HUSNBSS through classrooms, examinations, ceremonies, and everyday moments."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        {(!albums || albums.length === 0) && (
          <ScrollReveal3D type="fade-up">
            <div className="text-center py-16">
              <Images className="mx-auto text-husss-green-300 mb-4" size={48} />
              <p className="text-gray-400 italic text-lg">
                Photo albums will appear here once added.
              </p>
            </div>
          </ScrollReveal3D>
        )}

        <StaggeredReveal staggerDelay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(albums || []).map((album, index) => (
              <ScrollReveal3D key={album.id} type="slide-up-3d" delay={index * 80}>
                <Link
                  href={"/gallery/" + album.id}
                  className="block"
                >
                  <ParallaxCard
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 h-full"
                    glow
                    glowColor="rgba(30, 123, 52, 0.25)"
                  >
                    <div className="aspect-video bg-husss-green-50 relative overflow-hidden">
                      {album.cover_image_url && (
                        <img
                          src={album.cover_image_url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-husss-green-950/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <Images size={10} />
                          {album.gallery_images?.[0]?.count || 0} photos
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-medium text-husss-green-950 mb-1">{album.title_en}</p>
                      {album.description_en && (
                        <p className="text-sm text-gray-500 line-clamp-2">{album.description_en}</p>
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
