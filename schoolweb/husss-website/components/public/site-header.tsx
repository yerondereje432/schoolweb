"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";

const CORE_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/academics", label: "Academics" },
  { href: "/achievements", label: "Achievements" },
  { href: "/news", label: "News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/staff", label: "Staff" },
  { href: "/contact", label: "Contact" },
];

const LANGS = [
  { code: "en", label: "EN" },
  { code: "om", label: "OM" },
  { code: "am", label: "አማ" },
];

export default function SiteHeader({
  schoolShortName,
  logoUrl,
  customPages,
  phone,
  email,
}: {
  schoolShortName: string;
  logoUrl: string | null;
  customPages: { slug: string; title_en: string }[];
  phone?: string | null;
  email?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility strip — thin, deep-green, institutional register */}
      {(phone || email) && (
        <div className="hidden md:block bg-husss-green-950 text-white/70 text-xs">
          <div className="max-w-6xl mx-auto px-6 h-8 flex items-center gap-6">
            {phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-husss-gold-400" /> {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1.5">
                <Mail size={12} className="text-husss-gold-400" /> {email}
              </span>
            )}
            <span className="ml-auto tracking-wide">
              Grade 9–12 · Haramaya University, Ethiopia
            </span>
          </div>
        </div>
      )}

      {/* Main bar — bolder lockup, generous height, gold base line */}
      <div
        className={`bg-background/95 backdrop-blur-md border-b-2 border-husss-gold-500/70 transition-shadow ${
          scrolled ? "shadow-[0_8px_24px_-16px_rgba(13,56,24,0.35)]" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[84px]">
            <Link href="/" className="flex items-center gap-3.5 shrink-0">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={schoolShortName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-husss-gold-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-husss-green-950 flex items-center justify-center text-husss-gold-400 text-sm font-display font-semibold ring-2 ring-husss-gold-500/50">
                  {schoolShortName.slice(0, 4)}
                </div>
              )}
              <div className="hidden sm:block leading-tight">
                <p className="font-display font-semibold text-husss-green-950 text-lg tracking-tight">
                  {schoolShortName}
                </p>
                <p className="eyebrow text-[0.62rem] text-husss-green-700/80 mt-0.5">
                  Est. Excellence · HUSNBSS
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {CORE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-full text-[0.88rem] transition-colors ${
                    isActive(item.href)
                      ? "bg-husss-green-950 text-white font-medium"
                      : "text-foreground/65 hover:bg-husss-green-50 hover:text-husss-green-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {customPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/p/${p.slug}`}
                  className="px-3.5 py-2 rounded-full text-[0.88rem] text-foreground/65 hover:bg-husss-green-50 hover:text-husss-green-900 transition-colors"
                >
                  {p.title_en}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center rounded-full border border-hairline bg-surface p-0.5 text-xs">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    className="px-2.5 py-1 rounded-full text-muted hover:text-husss-green-800 font-medium transition-colors data-[active=true]:bg-husss-green-950 data-[active=true]:text-white"
                    data-active={l.code === "en"}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <button
                className="lg:hidden p-2 -mr-2 text-husss-green-900"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-hairline px-4 py-3 space-y-0.5 bg-surface">
            {CORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2.5 text-[0.95rem] ${
                  isActive(item.href)
                    ? "text-husss-green-800 font-medium"
                    : "text-foreground/75"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {customPages.map((p) => (
              <Link
                key={p.slug}
                href={`/p/${p.slug}`}
                className="block py-2.5 text-[0.95rem] text-foreground/75"
                onClick={() => setOpen(false)}
              >
                {p.title_en}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
