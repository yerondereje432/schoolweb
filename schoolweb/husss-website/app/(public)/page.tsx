import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Trophy, Newspaper, Star, GraduationCap } from "lucide-react";
import Reveal from "@/components/public/reveal";

// Always render fresh from Supabase — never serve a cached snapshot.
// News and hero-banner edits must be visible to every visitor immediately,
// regardless of whether they have an admin session cookie or not.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: banners },
    { data: featuredAccomplishments },
    { data: latestNews },
    { data: settings },
    { data: topStudents },
  ] = await Promise.all([
    supabase.from("hero_banners").select("*").eq("is_active", true).order("sort_order").limit(1),
    supabase.from("accomplishments").select("*").eq("is_featured", true).order("sort_order").limit(3),
    supabase.from("news_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("top_students").select("*").order("exam_year", { ascending: false }).order("rank").limit(3),
  ]);

  const hero = banners?.[0];
  const flagshipStat = featuredAccomplishments?.[0]?.stat_value;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-husss-green-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14]">
          {hero?.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        {/* Radial vignette so the seal + copy stay legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-husss-green-950/40 via-husss-green-950/70 to-husss-green-950" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-[1fr_auto] gap-14 items-center">
            <div>
              <span className="eyebrow text-husss-gold-400">
                Grade 9–12 · Haramaya, Ethiopia
              </span>
              <h1 className="font-display mt-4 text-4xl md:text-[3.25rem] font-semibold max-w-2xl leading-[1.08]">
                {hero?.title_en ||
                  settings?.school_name_en ||
                  "Haramaya University Special Non-Boarding Secondary School"}
              </h1>
              <p className="mt-6 text-white/65 max-w-xl text-lg leading-relaxed">
                {hero?.subtitle_en ||
                  "One of the most accomplished secondary schools in the region — known for outstanding results in the Ethiopian University Entrance Examination."}
              </p>
              <Link
                href={hero?.cta_link || "/about"}
                className="inline-flex items-center gap-2 mt-9 bg-husss-gold-500 text-husss-green-950 font-semibold px-6 py-3 rounded-full hover:bg-husss-gold-400 transition-colors"
              >
                {hero?.cta_text_en || "Explore HUSSS"} <ArrowRight size={18} />
              </Link>
            </div>

            {/* Signature element: a diploma-seal emblem for the flagship stat */}
            {flagshipStat && (
              <div className="hidden md:flex relative w-48 h-48 shrink-0 items-center justify-center">
                <div className="seal-burst absolute inset-0 opacity-90" />
                <div className="absolute inset-[10px] rounded-full bg-husss-green-950 border border-husss-gold-500/30" />
                <div className="relative text-center px-4">
                  <p className="font-display text-4xl font-semibold text-husss-gold-400 leading-none">
                    {flagshipStat}
                  </p>
                  <p className="text-[0.7rem] uppercase tracking-wide text-white/60 mt-2 leading-tight">
                    {featuredAccomplishments?.[0]?.title_en}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: "Grades Offered", value: "9–12" },
            { icon: Trophy, label: "EUEE Track Record", value: "Top Performing" },
            { icon: Star, label: "Top Students", value: `${topStudents?.length || 0}+ Recognized` },
            { icon: Newspaper, label: "Latest Updates", value: "Always Current" },
          ].map((item) => (
            <div
              key={item.label}
              className="card-hairline p-5 text-center"
            >
              <item.icon className="mx-auto text-husss-green-600 mb-2" size={20} />
              <p className="font-display font-semibold text-husss-green-950 text-sm">{item.value}</p>
              <p className="text-xs text-muted mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured accomplishments */}
      {featuredAccomplishments && featuredAccomplishments.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-2">Recognition</p>
                <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">
                  Featured Accomplishments
                </h2>
              </div>
              <Link href="/accomplishments" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0">
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAccomplishments.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <div className="card-hairline overflow-hidden h-full">
                  <div className="aspect-video bg-husss-green-50 overflow-hidden">
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {item.stat_value && (
                      <p className="font-display text-2xl font-semibold text-husss-green-700">{item.stat_value}</p>
                    )}
                    <p className="font-medium text-husss-green-950 mt-1">{item.title_en}</p>
                    {item.description_en && (
                      <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">{item.description_en}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews && latestNews.length > 0 && (
        <section className="bg-husss-green-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="eyebrow mb-2">Bulletin</p>
                  <h2 className="text-2xl md:text-3xl text-husss-green-950 gold-underline inline-block">
                    Latest News
                  </h2>
                </div>
                <Link href="/news" className="text-sm text-husss-green-700 hover:text-husss-green-900 flex items-center gap-1 shrink-0">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <Link
                    href={`/news/${post.slug}`}
                    className="card-hairline overflow-hidden block h-full"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {post.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-muted">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                      </p>
                      <p className="font-medium text-husss-green-950 mt-1">{post.title_en}</p>
                      {post.excerpt_en && (
                        <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">{post.excerpt_en}</p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-2xl md:text-3xl text-husss-green-950 mb-3">
            Learn more about HUSSS
          </h2>
          <p className="text-muted max-w-lg mx-auto mb-8 leading-relaxed">
            Discover our mission, academic programs, and the achievements that
            make HUSSS one of the leading secondary schools in the region.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/about"
              className="bg-husss-green-800 text-white font-medium px-6 py-3 rounded-full hover:bg-husss-green-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="border border-husss-green-800/25 text-husss-green-800 font-medium px-6 py-3 rounded-full hover:bg-husss-green-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
