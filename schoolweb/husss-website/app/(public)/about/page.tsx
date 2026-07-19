import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/public/page-hero";
import { GraduationCap, Target, Eye, BookOpen, Award } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";
import AnimatedCounter from "@/components/public/animations/AnimatedCounter";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_content").select("*").eq("id", 1).single();

  const isPlaceholder = !data?.mission_en && !data?.vision_en && !data?.history_en;

  return (
    <div className="relative">
      {/* Ambient geometric particles */}
      <GreenGeometric count={12} className="opacity-30" />

      <PageHero
        icon={<GraduationCap size={30} />}
        eyebrow="About HUSNBSS"
        title="About HUSNBSS"
        subtitle="Grades 9–12 · A legacy of academic excellence and strong results in the Ethiopian University Entrance Examination."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-14 relative z-10">
        {isPlaceholder && (
          <ScrollReveal3D type="fade-up">
            <div className="bg-husss-gold-100 border border-husss-gold-400 text-husss-gold-700 text-sm rounded-lg px-4 py-3">
              <strong>Placeholder notice:</strong> Mission, vision, and history
              text have not been added yet. A director can fill this in from{" "}
              <span className="font-medium">Admin → Mission &amp; About</span>.
            </div>
          </ScrollReveal3D>
        )}

        <StaggeredReveal staggerDelay={100}>
          <ScrollReveal3D type="slide-up-3d">
            <ParallaxCard className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-husss-green-100 flex items-center justify-center">
                  <Target className="text-husss-green-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-husss-green-950">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {data?.mission_en || "Mission statement to be added by school administration."}
              </p>
            </ParallaxCard>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" delay={100}>
            <ParallaxCard className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-husss-gold-100 flex items-center justify-center">
                  <Eye className="text-husss-gold-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-husss-green-950">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {data?.vision_en || "Vision statement to be added by school administration."}
              </p>
            </ParallaxCard>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" delay={200}>
            <ParallaxCard className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-husss-green-100 flex items-center justify-center">
                  <BookOpen className="text-husss-green-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-husss-green-950">Our History</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {data?.history_en || "History content to be added by school administration."}
              </p>
            </ParallaxCard>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" delay={300}>
            <ParallaxCard className="bg-husss-green-50 rounded-2xl border border-husss-green-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-500" glow glowColor="rgba(30, 123, 52, 0.3)">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-husss-green-100 flex items-center justify-center">
                  <Award className="text-husss-green-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-husss-green-950">Why HUSNBSS Is Distinguished</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {data?.why_distinguished_en || "HUSNBSS serves students in Grades 9 through 12 and is recognized as one of the most accomplished schools in its locality, particularly for its strong results in the Ethiopian University Entrance Examination (EUEE)."}
              </p>
            </ParallaxCard>
          </ScrollReveal3D>
        </StaggeredReveal>

        {/* Stats section with animated counters */}
        <ScrollReveal3D type="fade-up" delay={200}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <AnimatedCounter value={9} suffix="–12" prefix="" duration={1500} className="text-center" />
            <AnimatedCounter value={6} suffix="+" prefix="" duration={1800} className="text-center" />
            <AnimatedCounter value={100} suffix="%" prefix="" duration={2000} className="text-center" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 text-center text-sm text-gray-500">
            <span>Grades Offered</span>
            <span>Years of Excellence</span>
            <span>EUEE Pass Rate</span>
          </div>
        </ScrollReveal3D>
      </div>
    </div>
  );
}
