import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/public/page-hero";
import { GraduationCap, BookOpen } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";
import AnimatedCounter from "@/components/public/animations/AnimatedCounter";

const STREAM_LABELS: Record<string, string> = {
  natural_science: "Natural Science",
};

export default async function AcademicsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("academic_programs")
    .select("*")
    .order("grade_level")
    .order("sort_order");

  const grouped = (programs || []).reduce<Record<string, typeof programs>>(
    (acc, p) => {
      acc[p.grade_level] = acc[p.grade_level] || [];
      acc[p.grade_level]!.push(p);
      return acc;
    },
    {}
  );

  const totalPrograms = programs?.length || 0;
  const totalSubjects = programs?.reduce((sum, p) => sum + (p.subjects_en?.length || 0), 0) || 0;

  return (
    <div className="relative">
      {/* Ambient geometric particles */}
      <GreenGeometric count={15} className="opacity-30" />

      <PageHero
        icon={<GraduationCap size={30} />}
        eyebrow="Curriculum"
        title="Academics"
        subtitle="HUSNBSS serves Grades 9 through 12, following the Ethiopian national curriculum with Natural Science stream in Grades 11–12."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        {/* Stats header */}
        <ScrollReveal3D type="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <AnimatedCounter value={1} suffix="" duration={1500} className="text-center" />
            <AnimatedCounter value={4} suffix="" prefix="" duration={1800} className="text-center" />
            <AnimatedCounter value={14} suffix="" prefix="" duration={2000} className="text-center" />
            <AnimatedCounter value={1} suffix="" prefix="" duration={2200} className="text-center" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center text-sm text-gray-500">
            <span>Programs</span>
            <span>Grade Levels</span>
            <span>Subjects</span>
            <span>Streams</span>
          </div>
        </ScrollReveal3D>

        {Object.keys(grouped).length === 0 && (
          <ScrollReveal3D type="fade-up">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-husss-green-100 flex items-center justify-center">
                <GraduationCap className="text-husss-green-400" size={48} />
              </div>
              <p className="text-gray-400 italic text-lg">
                Academic program details will appear here once added by school administration.
              </p>
            </div>
          </ScrollReveal3D>
        )}

        <StaggeredReveal staggerDelay={150}>
          {["9", "10", "11", "12"].map((grade, gradeIndex) => {
            const entries = grouped[grade];
            if (!entries || entries.length === 0) return null;

            return (
              <ScrollReveal3D key={grade} type="slide-up-3d" delay={gradeIndex * 100}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-husss-green-600 text-white flex items-center justify-center text-lg font-bold animate-pulse-scale-3d">
                      {grade}
                    </div>
                    <h2 className="text-xl font-semibold text-husss-green-950">Grade {grade}</h2>
                    <span className="ml-auto text-sm text-husss-green-600 font-medium px-3 py-1 bg-husss-green-100 rounded-full">
                      {entries.length} Program{entries.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entries.map((program, programIndex) => (
                      <ScrollReveal3D key={program.id} type="fade-up" delay={programIndex * 80}>
                        <ParallaxCard
                          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all duration-500"
                          glow
                          glowColor="rgba(30, 123, 52, 0.2)"
                        >
                          {program.stream && (
                            <span className="inline-block text-xs font-medium text-husss-green-700 bg-husss-green-100 rounded-full px-2.5 py-1 mb-3">
                              {STREAM_LABELS[program.stream] || program.stream}
                            </span>
                          )}
                          <p className="font-medium text-husss-green-950 mb-2">
                            {program.title_en}
                          </p>
                          {program.description_en && (
                            <p className="text-sm text-gray-500 mb-3">{program.description_en}</p>
                          )}
                          {program.subjects_en && program.subjects_en.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {program.subjects_en.map((subject: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs text-husss-green-700 bg-husss-green-50 px-2.5 py-1 rounded-full border border-husss-green-100"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          )}
                        </ParallaxCard>
                      </ScrollReveal3D>
                    ))}
                  </div>
                </div>
              </ScrollReveal3D>
            );
          })}
        </StaggeredReveal>
      </div>
    </div>
  );
}
