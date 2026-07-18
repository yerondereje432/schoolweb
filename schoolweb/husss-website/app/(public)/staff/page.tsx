import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/public/page-hero";
import { Users, Crown } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";
import AnimatedCounter from "@/components/public/animations/AnimatedCounter";

export default async function StaffPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff_members")
    .select("*")
    .order("is_leadership", { ascending: false })
    .order("sort_order");

  const leadership = (staff || []).filter((s) => s.is_leadership);
  const others = (staff || []).filter((s) => !s.is_leadership);

  return (
    <div className="relative">
      <GreenGeometric count={12} className="opacity-25" />

      <PageHero
        icon={<Users size={28} />}
        eyebrow="Our People"
        title="Staff & Leadership"
        subtitle="The educators and administrators guiding HUSSS students toward excellence."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        {/* Stats */}
        <ScrollReveal3D type="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <AnimatedCounter value={leadership.length} suffix="" duration={1500} className="text-center" />
            <AnimatedCounter value={others.length} suffix="" prefix="" duration={1800} className="text-center" />
            <AnimatedCounter value={staff?.length || 0} suffix="" prefix="" duration={2000} className="text-center" />
            <AnimatedCounter value={Math.floor((staff?.length || 0) / 4)} suffix=":1" prefix="" duration={2200} className="text-center" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center text-sm text-gray-500">
            <span>Leadership</span>
            <span>Teachers & Staff</span>
            <span>Total Team</span>
            <span>Student Ratio</span>
          </div>
        </ScrollReveal3D>

        {leadership.length > 0 && (
          <StaggeredReveal staggerDelay={150}>
            <ScrollReveal3D type="slide-up-3d">
              <h2 className="text-xl font-semibold text-husss-green-950 gold-underline inline-block mb-8">
                Leadership
              </h2>
            </ScrollReveal3D>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
              {leadership.map((person, index) => (
                <ScrollReveal3D key={person.id} type="fade-up" delay={index * 100}>
                  <ParallaxCard
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-4 items-center hover:shadow-xl transition-all duration-500"
                    glow
                    glowColor="rgba(245, 168, 0, 0.3)"
                  >
                    <div className="w-24 h-24 rounded-full bg-husss-green-50 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {person.photo_url ? (
                        <img src={person.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Crown className="text-husss-gold-500" size={32} />
                      )}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-husss-gold-500 flex items-center justify-center border-4 border-white">
                        <Crown className="text-husss-green-950" size={14} />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-husss-green-950 text-lg">{person.full_name}</p>
                      <p className="text-sm text-husss-gold-600 font-medium mb-2">{person.role_en}</p>
                      {person.bio_en && (
                        <p className="text-sm text-gray-500 leading-relaxed">{person.bio_en}</p>
                      )}
                    </div>
                  </ParallaxCard>
                </ScrollReveal3D>
              ))}
            </div>
          </StaggeredReveal>
        )}

        {others.length > 0 && (
          <StaggeredReveal staggerDelay={100}>
            <ScrollReveal3D type="slide-up-3d">
              <h2 className="text-xl font-semibold text-husss-green-950 gold-underline inline-block mb-8">
                Teachers & Staff
              </h2>
            </ScrollReveal3D>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {others.map((person, index) => (
                <ScrollReveal3D key={person.id} type="fade-up" delay={index * 50}>
                  <ParallaxCard
                    className="text-center bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-xl transition-all duration-500"
                    glow
                    glowColor="rgba(30, 123, 52, 0.2)"
                    maxTilt={8}
                  >
                    <div className="w-24 h-24 rounded-full bg-husss-green-50 overflow-hidden mx-auto mb-4 flex items-center justify-center">
                      {person.photo_url ? (
                        <img src={person.photo_url} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      ) : (
                        <Users className="text-husss-green-300" size={28} />
                      )}
                    </div>
                    <p className="font-medium text-husss-green-950 text-sm mb-1">{person.full_name}</p>
                    <p className="text-xs text-gray-500">{person.role_en}</p>
                  </ParallaxCard>
                </ScrollReveal3D>
              ))}
            </div>
          </StaggeredReveal>
        )}

        {leadership.length === 0 && others.length === 0 && (
          <ScrollReveal3D type="fade-up">
            <div className="text-center py-16">
              <Users className="mx-auto text-husss-green-300 mb-4" size={48} />
              <p className="text-gray-400 italic text-lg">
                Staff and leadership profiles will appear here once added.
              </p>
            </div>
          </ScrollReveal3D>
        )}
      </div>
    </div>
  );
}
