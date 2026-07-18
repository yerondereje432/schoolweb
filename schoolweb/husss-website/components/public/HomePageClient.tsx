"use client";

import { ArrowRight, Trophy, Newspaper, Star, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";
import {
  ThreeDBackground,
  ScrollReveal3D,
  StaggeredReveal,
  ParallaxCard,
  AnimatedCounter,
  MagneticButton,
  CursorGlow,
  MagneticElement,
  TextReveal,
  GradientText,
  GoldenDust,
  GreenGeometric,
} from "@/components/public/animations";

interface HomePageClientProps {
  hero: {
    image_url?: string | null;
    title_en?: string | null;
    subtitle_en?: string | null;
    cta_link?: string | null;
    cta_text_en?: string | null;
  } | null;
  featuredAccomplishments: Array<{
    id: string;
    image_url?: string | null;
    stat_value?: string | number | null;
    title_en: string;
    description_en?: string | null;
  }> | null;
  latestNews: Array<{
    id: string;
    slug: string;
    cover_image_url?: string | null;
    published_at?: string | null;
    title_en: string;
    excerpt_en?: string | null;
    news_categories?: { name_en: string } | null;
  }> | null;
  settings: { school_name_en?: string | null } | null;
  topStudents: Array<{ id: string }> | null;
}

export default function HomePageClient({
  hero,
  featuredAccomplishments,
  latestNews,
  settings,
  topStudents,
}: HomePageClientProps) {
  const flagshipStat = featuredAccomplishments?.[0]?.stat_value;

  return (
    <div className="relative">
      {/* Global cursor glow effect */}
      <CursorGlow intensity="medium" color="rgba(245, 168, 0, 0.35)" size={400} />

      {/* Ambient golden dust particles across entire page */}
      <GoldenDust count={35} className="opacity-30" />

      {/* ============================================================
           HERO SECTION
           ============================================================ */}
      <section className="relative bg-husss-green-950 text-white overflow-hidden min-h-screen flex items-center">
        <ThreeDBackground colorScheme="green-gold" intensity="high" />

        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          {hero?.image_url && (
            <img src={hero.image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-husss-green-950/60 via-husss-green-900/20 to-husss-green-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--color-husss-gold-500)_0%,_transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,_var(--color-husss-green-600)_0%,_transparent_60%)] opacity-20" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-husss-gold-500/05 animate-rotate-y-slow pointer-events-none" style={{ animationDuration: "80s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-husss-gold-500/03 animate-rotate-x-slow pointer-events-none" style={{ animationDuration: "60s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-husss-gold-500/02 animate-rotate-y-slow pointer-events-none" style={{ animationDuration: "40s", animationDirection: "reverse" }} />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-husss-gold-500/10 to-husss-green-600/10 blur-3xl animate-morph-blob pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-bl from-husss-gold-400/08 to-husss-green-700/08 blur-3xl animate-morph-blob pointer-events-none" style={{ animationDelay: "-6s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
            {/* LEFT: Content */}
            <div className="relative z-10">
              <StaggeredReveal staggerDelay={100}>
                <ScrollReveal3D type="fade-up" duration={700}>
                  <TextReveal type="chars" stagger={20} delay={100} as="span" className="eyebrow text-husss-gold-400">
                    Grade 9–12 · Haramaya, Ethiopia
                  </TextReveal>
                </ScrollReveal3D>

                <ScrollReveal3D type="slide-up-3d" duration={900} delay={200}>
                  <h1 className="font-display mt-4 text-4xl md:text-[3.5rem] lg:text-[4.5rem] font-semibold leading-[1.05] max-w-2xl">
                    <GradientText colors={["#ffffff", "#ffc233", "#f5a800", "#ffffff"]} duration={5000}>
                      {hero?.title_en || settings?.school_name_en || "Haramaya University Special Non-Boarding Secondary School"}
                    </GradientText>
                  </h1>
                </ScrollReveal3D>

                <ScrollReveal3D type="fade-up" duration={700} delay={300}>
                  <TextReveal type="words" stagger={40} delay={100} as="p" className="text-white/65 mt-6 max-w-xl text-lg leading-relaxed">
                    {hero?.subtitle_en || "One of the most accomplished secondary schools in the region — known for outstanding results in the Ethiopian University Entrance Examination."}
                  </TextReveal>
                </ScrollReveal3D>

                <ScrollReveal3D type="flip-y" duration={800} delay={400}>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <MagneticElement strength={0.4} scaleOnHover={1.05}>
                      <MagneticButton variant="primary" size="lg" className="group">
                        {hero?.cta_text_en || "Explore HUSSS"}
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </MagneticButton>
                    </MagneticElement>

                    <MagneticElement strength={0.4} scaleOnHover={1.05}>
                      <MagneticButton variant="outline" size="lg" className="bg-transparent border-2 border-husss-gold-500 text-husss-gold-400 hover:bg-husss-gold-500/10">
                        <GraduationCap size={20} className="mr-2" />
                        View Academics
                      </MagneticButton>
                    </MagneticElement>
                  </div>
                </ScrollReveal3D>

                <ScrollReveal3D type="fade-up" duration={600} delay={800}>
                  <div className="mt-16 flex items-center gap-3 text-white/40 animate-scroll-bounce-3d">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-medium">Scroll to discover</p>
                      <p className="text-[0.65rem] text-white/30">Experience excellence in 3D</p>
                    </div>
                  </div>
                </ScrollReveal3D>
              </StaggeredReveal>
            </div>

            {/* RIGHT: Flagship Stat */}
            {flagshipStat && (
              <ScrollReveal3D type="perspective-reveal" duration={1000} delay={300}>
                <div className="hidden lg:flex relative w-64 h-64 shrink-0 items-center justify-center">
                  <MagneticElement strength={0.2} maxDistance={200} scaleOnHover={1.02} rotateOnHover={true}>
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-husss-gold-500/30 to-transparent blur-xl animate-pulse-scale-3d" />
                      <div className="seal-burst absolute inset-0 opacity-90 animate-rotate-y-slow" style={{ animationDuration: "30s" }} />
                      <div className="absolute inset-[8px] rounded-full bg-husss-green-950 border-2 border-husss-gold-500/40" />
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-husss-green-800 to-husss-green-950 flex flex-col items-center justify-center p-6">
                        <div className="absolute inset-4 rounded-full border border-husss-gold-500/20" />
                        <div className="relative z-10 text-center">
                          <AnimatedCounter value={flagshipStat} duration={2000} delay={500} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-husss-gold-400 leading-none" />
                          <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mt-3 leading-tight max-w-xs mx-auto">
                            {featuredAccomplishments?.[0]?.title_en || "Flagship Achievement"}
                          </p>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-husss-gold-500 animate-pulse-scale-3d" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-husss-gold-500 animate-pulse-scale-3d" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-husss-gold-500 animate-pulse-scale-3d" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </MagneticElement>
                </div>
              </ScrollReveal3D>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
           QUICK HIGHLIGHTS
           ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-10">
        <GreenGeometric count={8} className="opacity-20" />

        <StaggeredReveal staggerDelay={120}>
          {[
            { icon: GraduationCap, label: "Grades Offered", value: "9–12", suffix: "" },
            { icon: Trophy, label: "EUEE Track Record", value: "Top", suffix: " Performing" },
            { icon: Star, label: "Top Students", value: topStudents?.length || 0, suffix: "+ Recognized" },
            { icon: Newspaper, label: "Latest Updates", value: "Always", suffix: " Current" },
          ].map((item, index) => (
            <ScrollReveal3D key={item.label} type="slide-up-3d" delay={index * 80}>
              <MagneticElement strength={0.3} scaleOnHover={1.04} rotateOnHover={true}>
                <ParallaxCard className="card-hairline p-6 text-center h-full bg-white/80 backdrop-blur-sm border-husss-green-100 hover:border-husss-gold-300" glow glowColor="rgba(245, 168, 0, 0.25)" maxTilt={8}>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-husss-green-100 to-husss-gold-100 flex items-center justify-center animate-float-3d" style={{ animationDelay: `${index * 200}ms` }}>
                    <item.icon className="text-husss-green-600" size={24} />
                  </div>
                  <TextReveal type="chars" stagger={30} as="p" className="font-display text-husss-green-950">
                    {typeof item.value === "number" ? (
                      <>
                        <AnimatedCounter value={item.value} duration={1500} delay={300} className="text-3xl md:text-4xl font-bold" />
                        <span className="text-husss-gold-500">{item.suffix}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl md:text-4xl font-bold text-husss-green-950">{item.value}</span>
                        <span className="text-husss-gold-500">{item.suffix}</span>
                      </>
                    )}
                  </TextReveal>
                  <p className="text-xs text-muted mt-2 uppercase tracking-wide font-medium">{item.label}</p>
                </ParallaxCard>
              </MagneticElement>
            </ScrollReveal3D>
          ))}
        </StaggeredReveal>
      </section>

      {/* ============================================================
           FEATURED ACCOMPLISHMENTS
           ============================================================ */}
      {featuredAccomplishments && featuredAccomplishments.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <GreenGeometric count={6} className="opacity-15" />

          <StaggeredReveal staggerDelay={150}>
            <ScrollReveal3D type="slide-up-3d">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <TextReveal type="chars" stagger={20} as="p" className="eyebrow mb-2">Recognition</TextReveal>
                  <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">Featured Accomplishments</h2>
                </div>
                <MagneticElement strength={0.2} scaleOnHover={1.03}>
                  <Link href="/accomplishments" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0 group">
                    View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticElement>
              </div>
            </ScrollReveal3D>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAccomplishments.map((item, i) => (
                <ScrollReveal3D key={item.id} type="slide-up-3d" delay={i * 100}>
                  <MagneticElement strength={0.25} scaleOnHover={1.02} rotateOnHover={true}>
                    <ParallaxCard className="card-hairline overflow-hidden h-full hover:shadow-2xl transition-all duration-700" glow glowColor="rgba(30, 123, 52, 0.3)" maxTilt={6}>
                      <div className="aspect-video bg-husss-green-50 relative overflow-hidden">
                        {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover transition-transform duration-1000 ease-out" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950/70 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                          <span className="text-xs font-medium text-husss-gold-400 bg-husss-green-950/80 backdrop-blur-sm px-3 py-1 rounded-full">Recognition</span>
                          {item.stat_value && <AnimatedCounter value={item.stat_value} duration={1200} className="font-display text-2xl font-bold text-husss-gold-400" />}
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="font-medium text-husss-green-950 text-lg">{item.title_en}</p>
                        {item.description_en && <p className="text-sm text-muted mt-2 line-clamp-3 leading-relaxed">{item.description_en}</p>}
                      </div>
                    </ParallaxCard>
                  </MagneticElement>
                </ScrollReveal3D>
              ))}
            </div>
          </StaggeredReveal>
        </section>
      )}

      {/* ============================================================
           LATEST NEWS
           ============================================================ */}
      {latestNews && latestNews.length > 0 && (
        <section className="relative bg-husss-green-50 py-24">
          <GreenGeometric count={6} className="opacity-15" />

          <StaggeredReveal staggerDelay={150}>
            <ScrollReveal3D type="slide-up-3d">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <TextReveal type="chars" stagger={20} as="p" className="eyebrow mb-2">Bulletin</TextReveal>
                    <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">Latest News</h2>
                  </div>
                  <MagneticElement strength={0.2} scaleOnHover={1.03}>
                    <Link href="/news" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0 group">
                      View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </MagneticElement>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestNews.map((post, i) => (
                    <ScrollReveal3D key={post.id} type="slide-up-3d" delay={i * 100}>
                      <MagneticElement strength={0.25} scaleOnHover={1.02} rotateOnHover={true}>
                        <Link href={`/news/${post.slug}`}>
                          <ParallaxCard className="card-hairline overflow-hidden h-full bg-white hover:shadow-2xl transition-all duration-700" glow glowColor="rgba(245, 168, 0, 0.25)" maxTilt={6}>
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                              {post.cover_image_url && <img src={post.cover_image_url} alt="" className="w-full h-full object-cover transition-transform duration-1000 ease-out" />}
                              <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950/60 via-transparent to-transparent" />
                            </div>
                            <div className="p-6">
                              <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                                {post.news_categories && (
                                  <>
                                    <span>·</span>
                                    <span className="text-husss-gold-400 font-medium px-2 py-0.5 bg-husss-green-950/80 backdrop-blur-sm rounded-full">
                                      {(post.news_categories as { name_en: string }).name_en}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="font-semibold text-husss-green-950 leading-snug text-lg">{post.title_en}</p>
                              {post.excerpt_en && <p className="text-sm text-white/60 mt-3 line-clamp-2 leading-relaxed">{post.excerpt_en}</p>}
                            </div>
                          </ParallaxCard>
                        </Link>
                      </MagneticElement>
                    </ScrollReveal3D>
                  ))}
                </div>
              </div>
            </ScrollReveal3D>
          </StaggeredReveal>
        </section>
      )}

      {/* ============================================================
           CTA SECTION
           ============================================================ */}
      <section className="relative overflow-hidden">
        <ThreeDBackground colorScheme="green-gold" intensity="low" className="opacity-50" />
        <GreenGeometric count={10} className="opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <StaggeredReveal staggerDelay={120}>
            <ScrollReveal3D type="slide-up-3d">
              <TextReveal type="words" stagger={40} as="h2" className="text-2xl md:text-3xl lg:text-4xl text-husss-green-950 mb-4">
                Learn more about HUSSS
              </TextReveal>
            </ScrollReveal3D>

            <ScrollReveal3D type="fade-up" delay={200}>
              <TextReveal type="words" stagger={30} as="p" className="text-muted max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
                Discover our mission, academic programs, and the achievements that make HUSSS one of the leading secondary schools in the region.
              </TextReveal>
            </ScrollReveal3D>

            <ScrollReveal3D type="flip-y" delay={300}>
              <div className="flex gap-4 justify-center flex-wrap">
                <MagneticElement strength={0.4} scaleOnHover={1.05}>
                  <MagneticButton variant="primary" size="lg" className="group">
                    <GradientText colors={["#ffffff", "#ffc233", "#ffffff"]} duration={3000} className="text-husss-green-950">
                      About Us
                    </GradientText>
                    <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </MagneticButton>
                </MagneticElement>

                <MagneticElement strength={0.4} scaleOnHover={1.05}>
                  <MagneticButton variant="secondary" size="lg" className="bg-husss-green-800 text-white hover:bg-husss-green-900 group">
                    <Mail size={20} className="mr-2" />
                    Contact Us
                  </MagneticButton>
                </MagneticElement>
              </div>
            </ScrollReveal3D>
          </StaggeredReveal>
        </div>
      </section>

      <div className="relative h-4 bg-gradient-to-r from-transparent via-husss-gold-500/30 to-transparent" />
    </div>
  );
}
