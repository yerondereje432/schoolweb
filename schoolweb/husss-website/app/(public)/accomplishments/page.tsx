import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/public/page-hero";
import { Trophy, Medal, Star } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GoldenDust } from "@/components/public/animations/FloatingParticles";
import AnimatedCounter from "@/components/public/animations/AnimatedCounter";

const CATEGORY_LABELS: Record<string, string> = {
  award: "Award",
  exam_result: "Exam Result",
  ranking: "Ranking",
  recognition: "Recognition",
};

export default async function AccomplishmentsPage() {
  const supabase = await createClient();
  const [{ data: accomplishments }, { data: topStudents }] = await Promise.all([
    supabase.from("accomplishments").select("*").order("year", { ascending: false }).order("sort_order"),
    supabase.from("top_students").select("*").order("exam_year", { ascending: false }).order("rank"),
  ]);

  const years = Array.from(new Set((topStudents || []).map((s) => s.exam_year))).sort(
    (a, b) => b - a
  );

  const totalAccomplishments = accomplishments?.length || 0;
  const totalTopStudents = topStudents?.length || 0;
  const latestYear = years[0] || new Date().getFullYear();

  return (
    <div className="relative">
      {/* Golden dust particles for achievements */}
      <GoldenDust count={25} className="opacity-40" />

      <PageHero
        icon={<Trophy size={28} />}
        eyebrow="Recognition"
        title="Accomplishments"
        subtitle="Exam results, awards, and recognitions that reflect HUSSS's track record of excellence."
      />

      {/* Top students by year */}
      {years.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative z-10">
          <ScrollReveal3D type="fade-up">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-husss-gold-500" size={22} />
                  <h2 className="text-2xl font-semibold text-husss-green-950 gold-underline inline-block">
                    Top EUEE Grade 12 Scorers
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <AnimatedCounter value={totalTopStudents} suffix="" duration={1500} className="text-center" />
                  <AnimatedCounter value={years.length} suffix="" prefix="" duration={1800} className="text-center" />
                  <AnimatedCounter value={latestYear} suffix="" prefix="" duration={2000} className="text-center" />
                </div>
                <div className="grid grid-cols-3 gap-6 mt-2 text-center text-sm text-gray-500">
                  <span>Total Top Students</span>
                  <span>Academic Years</span>
                  <span>Latest Year</span>
                </div>
              </div>
            </div>
          </ScrollReveal3D>

          <StaggeredReveal staggerDelay={150}>
            {years.map((year, yearIndex) => {
              const students = (topStudents || []).filter((s) => s.exam_year === year);
              return (
                <ScrollReveal3D key={year} type="slide-up-3d" delay={yearIndex * 100}>
                  <div className="mb-12">
                    <h3 className="text-sm font-semibold text-husss-green-800 mb-6">
                      {year} / {year + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {students.map((student, studentIndex) => (
                        <ScrollReveal3D key={student.id} type="fade-up" delay={studentIndex * 80}>
                          <ParallaxCard
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-xl transition-all duration-500"
                            glow
                            glowColor={student.rank === 1 ? "rgba(245, 168, 0, 0.4)" : student.rank === 2 ? "rgba(156, 163, 175, 0.4)" : "rgba(180, 119, 7, 0.4)"}
                          >
                            <div className="relative mb-4">
                              <div className="w-24 h-24 rounded-full bg-husss-green-50 mx-auto overflow-hidden flex items-center justify-center">
                                {student.photo_url ? (
                                  <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Medal
                                    className={
                                      student.rank === 1
                                        ? "text-husss-gold-500"
                                        : student.rank === 2
                                        ? "text-gray-400"
                                        : "text-amber-700"
                                    }
                                    size={36}
                                  />
                                )}
                              </div>
                              {/* Rank badge */}
                              <div className="absolute -top-2 -right-2">
                                <span
                                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                    student.rank === 1
                                      ? "bg-husss-gold-500 text-husss-green-950"
                                      : student.rank === 2
                                      ? "bg-gray-300 text-gray-700"
                                      : "bg-amber-700 text-white"
                                  }`}
                                >
                                  {student.rank}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-husss-gold-600 mb-1">Rank {student.rank}</p>
                            <p className="font-semibold text-husss-green-950">{student.full_name}</p>
                            {student.score && (
                              <p className="text-sm text-gray-500 mt-1">{student.score}</p>
                            )}
                            {student.quote_en && (
                              <p className="text-sm text-gray-500 italic mt-3 border-t border-gray-100 pt-3">
                                &ldquo;{student.quote_en}&rdquo;
                              </p>
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
        </section>
      )}

      {/* Accomplishments grid */}
      <section className="bg-husss-green-50 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal3D type="fade-up">
            <h2 className="text-2xl font-semibold text-husss-green-950 gold-underline inline-block mb-10">
              Awards & Recognitions
            </h2>
          </ScrollReveal3D>

          {(!accomplishments || accomplishments.length === 0) && (
            <ScrollReveal3D type="fade-up">
              <div className="text-center py-16">
                <Trophy className="mx-auto text-husss-green-300 mb-4" size={48} />
                <p className="text-gray-400 italic">Accomplishments will appear here as they are added.</p>
              </div>
            </ScrollReveal3D>
          )}

          <StaggeredReveal staggerDelay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(accomplishments || []).map((item, index) => (
                <ScrollReveal3D key={item.id} type="slide-up-3d" delay={index * 80}>
                  <ParallaxCard
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500"
                    glow
                    glowColor="rgba(245, 168, 0, 0.3)"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-5 relative">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-husss-green-700 bg-husss-green-100 rounded-full px-2.5 py-1">
                        <Star size={11} /> {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      {item.stat_value && (
                        <p className="text-2xl font-bold text-husss-green-700 mt-3 animate-pulse-scale-3d">
                          {item.stat_value}
                        </p>
                      )}
                      <p className="font-medium text-husss-green-950 mt-1">{item.title_en}</p>
                      {item.description_en && (
                        <p className="text-sm text-gray-500 mt-1.5">{item.description_en}</p>
                      )}
                      {item.year && (
                        <p className="text-xs text-gray-400 mt-2">{item.year}</p>
                      )}
                    </div>
                  </ParallaxCard>
                </ScrollReveal3D>
              ))}
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </div>
  );
}