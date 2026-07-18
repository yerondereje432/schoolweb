import SiteHeader from "@/components/public/site-header";
import SiteFooter from "@/components/public/site-footer";
import { getSiteSettings, getContactInfo, getPublishedCustomPages } from "@/lib/public-data";

// Always render fresh from Supabase — this layout wraps every public page,
// so a stale cached copy here would affect the whole site, not just one
// route. See app/(public)/page.tsx for the fuller explanation.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contact, customPages] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getPublishedCustomPages(),
  ]);

  return (
    <>
      <SiteHeader
        schoolShortName={settings?.short_name || "HUSSS"}
        logoUrl={settings?.logo_url || null}
        customPages={customPages.map((p) => ({
          slug: p.slug,
          title_en: p.title_en,
        }))}
        phone={contact?.phone_primary || null}
        email={contact?.email_primary || null}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        schoolNameEn={
          settings?.school_name_en ||
          "Haramaya University Special Non-Boarding Secondary School"
        }
        footerText={settings?.footer_text_en || null}
        contact={contact}
      />
    </>
  );
}
