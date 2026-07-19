import Link from "next/link";
import { Send, Music2, Mail, Phone, MapPin, Share2 } from "lucide-react";

export default function SiteFooter({
  schoolNameEn,
  footerText,
  contact,
}: {
  schoolNameEn: string;
  footerText: string | null;
  contact: {
    address_en: string | null;
    phone_primary: string | null;
    email_primary: string | null;
    facebook_url: string | null;
    telegram_url: string | null;
    youtube_url: string | null;
    tiktok_url: string | null;
    x_url: string | null;
  } | null;
}) {
  const year = new Date().getFullYear();

  const socials = [
    { url: contact?.facebook_url, icon: Share2, label: "Facebook" },
    { url: contact?.telegram_url, icon: Send, label: "Telegram" },
    { url: contact?.youtube_url, icon: Share2, label: "YouTube" },
    { url: contact?.tiktok_url, icon: Music2, label: "TikTok" },
    { url: contact?.x_url, icon: Share2, label: "X" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-husss-green-950 text-white/75 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-white text-lg font-semibold mb-2.5">{schoolNameEn}</p>
          <p className="text-sm text-white/55 leading-relaxed max-w-xs">
            {footerText || `© ${year} ${schoolNameEn}. All rights reserved.`}
          </p>
        </div>

        <div>
          <p className="eyebrow text-husss-gold-400 mb-4">Contact</p>
          <div className="space-y-2.5 text-sm">
            {contact?.address_en && (
              <p className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-husss-gold-400" />
                {contact.address_en}
              </p>
            )}
            {contact?.phone_primary && (
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-husss-gold-400" />
                {contact.phone_primary}
              </p>
            )}
            {contact?.email_primary && (
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-husss-gold-400" />
                {contact.email_primary}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="eyebrow text-husss-gold-400 mb-4">Quick Links</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/academics" className="hover:text-white transition-colors">Academics</Link>
            <Link href="/accomplishments" className="hover:text-white transition-colors">Accomplishments</Link>
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          {socials.length > 0 && (
            <div className="flex gap-2.5 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:bg-husss-gold-500 hover:border-husss-gold-500 hover:text-husss-green-950 transition-colors"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/35 tracking-wide">
       © 2026 {schoolNameEn}. All rights reserved.
      </div>
    </footer>
  );
}
