"use client";

import { ArrowRight, Trophy, Newspaper, Star, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";
import {
  ScrollReveal3D,
  StaggeredReveal,
  AnimatedCounter,
  TextReveal,
  GoldenDust,
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
      {/* Golden dust particles */}
      <GoldenDust count={20} className="opacity-20" />

      {/* ============================================================
           HERO SECTION - Clean, no 3D background
           ============================================================ */}
      <section className="relative bg-husss-green-950 text-white overflow-hidden min-h-screen flex items-center">
        {/* Hero image from CMS */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          {hero?.image_url && (
            <img src={hero.image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Depth gradients only - no Three.js */}
        <div className="absolute inset-0 bg-gradient-to-b from-husss-green-950/50 via-husss-green-900/20 to-husss-green-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--color-husss-gold-500)_0%,_transparent_50%)] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
            {/* LEFT: Content with letter queue animation */}
            <div className="relative z-10">
              <StaggeredReveal staggerDelay={100}>
                {/* Eyebrow - char queue */}
                <ScrollReveal3D type="fade-up" duration={700}>
                  <TextReveal type="chars" stagger={20} delay={100} as="span" className="eyebrow text-husss-gold-400">
                    Grade 9–12 · Haramaya, Ethiopia
                  </TextReveal>
                </ScrollReveal3D>

                {/* Headline - word queue */}
                <ScrollReveal3D type="slide-up-3d" duration={900} delay={200}>
                  <h1 className="font-display mt-4 text-4xl md:text-[3.5rem] lg:text-[4.5rem] font-semibold leading-[1.05] max-w-2xl text-white">
                    <TextReveal type="words" stagger={40} delay={100} as="span">
                      {hero?.title_en || settings?.school_name_en || "Haramaya University Special Non-Boarding Secondary School"}
                    </TextReveal>
                  </h1>
                </ScrollReveal3D>

                {/* Subtitle - word queue */}
                <ScrollReveal3D type="fade-up" duration={700} delay={300}>
                  <TextReveal type="words" stagger={30} delay={100} as="p" className="text-white/65 mt-6 max-w-xl text-lg leading-relaxed">
                    {hero?.subtitle_en || "One of the most accomplished secondary schools in the region — known for outstanding results in the Ethiopian University Entrance Examination."}
                  </TextReveal>
                </ScrollReveal3D>

                {/* CTA Buttons - PREMIUM GOLD */}
                <ScrollReveal3D type="fade-up" duration={800} delay={400}>
                  <div className="mt-10 flex flex-wrap gap-4">
                    {/* Primary: Gold gradient with glow */}
                    <Link
                      href={hero?.cta_link || "/about"}
                      className="relative inline-flex items-center gap-2 group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-husss-gold-500 via-husss-gold-400 to-husss-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -inset-1" />
                      <span className="relative bg-gradient-to-r from-husss-gold-500 via-husss-gold-400 to-husss-gold-500 text-husss-green-950 font-semibold px-8 py-4 rounded-full hover:from-husss-gold-400 hover:via-husss-gold-300 hover:to-husss-gold-400 transition-all duration-300 shadow-lg shadow-husss-gold-500/30 hover:shadow-xl hover:shadow-husss-gold-500/50">
                        {hero?.cta_text_en || "Explore HUSSS"}
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>

                    {/* Secondary: Gold outline with fill on hover */}
                    <Link
                      href="/academics"
                      className="relative inline-flex items-center gap-2 overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-husss-gold-500 to-husss-gold-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                      <span className="relative border-2 border-husss-gold-500 text-husss-gold-400 font-semibold px-8 py-4 rounded-full hover:text-husss-green-950 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-husss-gold-500/30">
                        <GraduationCap size={18} className="mr-2" />
                        View Academics
                      </span>
                    </Link>
                  </div>
                </ScrollReveal3D>

                {/* Scroll indicator */}
                <ScrollReveal3D type="fade-up" duration={600} delay={800}>
                  <div className="mt-16 flex items-center gap-3 text-white/40">
                    <div className="w-12 h-12 rounded-full border border-husss-gold-500/30 flex items-center justify-center bg-husss-gold-500/10">
                      <svg className="w-5 h-5 text-husss-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-medium text-husss-gold-300">Scroll to discover</p>
                    </div>
                  </div>
                </ScrollReveal3D>
              </StaggeredReveal>
            </div>

            {/* RIGHT: Flagship Stat - simple, no magnetic */}
            {flagshipStat && (
              <ScrollReveal3D type="fade-up" duration={1000} delay={300}>
                <div className="hidden lg:flex relative w-64 h-64 shrink-0 items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="seal-burst absolute inset-0 opacity-90" />
                    <div className="absolute inset-[8px] rounded-full bg-husss-green-950 border-2 border-husss-gold-500/40" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-husss-green-800 to-husss-green-950 flex flex-col items-center justify-center p-6">
                      <div className="absolute inset-4 rounded-full border border-husss-gold-500/20" />
                      <div className="relative z-10 text-center">
                        <AnimatedCounter value={flagshipStat} duration={2000} delay={500} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-husss-gold-400 leading-none" />
                        <p className="text-[0.7rem] uppercase tracking-widest text-white/50 mt-3 leading-tight max-w-xs mx-auto">
                          {featuredAccomplishments?.[0]?.title_en || "Flagship Achievement"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal3D>
            )}
          </div>
        </div>
      </section>
      {/* ============================================================
           FEATURED ACCOMPLISHMENTS - Regular cards
           ============================================================ */}
      {featuredAccomplishments && featuredAccomplishments.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <StaggeredReveal staggerDelay={150}>
            <ScrollReveal3D type="slide-up-3d">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <TextReveal type="chars" stagger={20} as="p" className="eyebrow mb-2">Recognition</TextReveal>
                  <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">Featured Achievements</h2>
                </div>
                <Link href="/accomplishments" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal3D>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAccomplishments.map((item, i) => (
                <ScrollReveal3D key={item.id} type="slide-up-3d" delay={i * 100}>
                  <Link href="/accomplishments" className="block">
                    <div className="card-hairline overflow-hidden h-full transition-shadow hover:shadow-lg hover:border-husss-gold-300 border-husss-green-100">
                      <div className="aspect-video bg-husss-green-50 relative overflow-hidden">
                        {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />}
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
                    </div>
                  </Link>
                </ScrollReveal3D>
              ))}
            </div>
          </StaggeredReveal>
        </section>
      )}

      {/* ============================================================
           LATEST NEWS - Regular cards
           ============================================================ */}
      {latestNews && latestNews.length > 0 && (
        <section className="relative bg-husss-green-50 py-24">
          <StaggeredReveal staggerDelay={150}>
            <ScrollReveal3D type="slide-up-3d">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <TextReveal type="chars" stagger={20} as="p" className="eyebrow mb-2">Bulletin</TextReveal>
                    <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">Latest News</h2>
                  </div>
                  <Link href="/news" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestNews.map((post, i) => (
                    <ScrollReveal3D key={post.id} type="slide-up-3d" delay={i * 100}>
                      <Link href={`/news/${post.slug}`} className="block">
                        <div className="card-hairline overflow-hidden h-full bg-white transition-shadow hover:shadow-lg hover:border-husss-gold-300 border-husss-green-100">
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            {post.cover_image_url && <img src={post.cover_image_url} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />}
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
                        </div>
                      </Link>
                    </ScrollReveal3D>
                  ))}
                </div>
              </div>
            </ScrollReveal3D>
          </StaggeredReveal>
        </section>
      )}

      {/* ============================================================
           CTA SECTION - PREMIUM GOLD BUTTONS
           ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-husss-gold-500 to-transparent" />
        
        <StaggeredReveal staggerDelay={120}>
          <ScrollReveal3D type="slide-up-3d">
            <TextReveal type="words" stagger={40} as="h2" className="text-2xl md:text-3xl lg:text-4xl text-husss-green-950 mb-4">
              Learn more about HUSNBSS
            </TextReveal>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={200}>
            <TextReveal type="words" stagger={30} as="p" className="text-muted max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
              Discover our mission, academic programs, and the achievements that make HUSNBSS one of the leading secondary schools in the region.
            </TextReveal>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={300}>
            <div className="flex gap-4 justify-center flex-wrap">
              {/* About Us - Gold gradient fill */}
              <Link
                href="/about"
                className="relative inline-flex items-center gap-2 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-husss-gold-500 via-husss-gold-400 to-husss-gold-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                <span className="relative border-2 border-husss-gold-500 text-husss-gold-400 font-semibold px-8 py-4 rounded-full hover:text-husss-green-950 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-husss-gold-500/30">
                  <TextReveal type="chars" stagger={20} as="span" className="text-husss-gold-400">About Us</TextReveal>
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              {/* Contact Us - Gold gradient fill */}
              <Link
                href="/contact"
                className="relative inline-flex items-center gap-2 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-husss-green-800 via-husss-green-700 to-husss-gold-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                <span className="relative border-2 border-husss-green-800 text-husss-green-800 font-semibold px-8 py-4 rounded-full hover:text-white transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-husss-green-800/30">
                  <Mail size={18} className="mr-2 text-husss-gold-400" />
                  Contact Us
                </span>
              </Link>
            </div>
          </ScrollReveal3D>
        </StaggeredReveal>
      </section>

      <div className="relative h-4 bg-gradient-to-r from-transparent via-husss-gold-500/30 to-transparent" />
    </div>
  );
}
