import LoginForm from "./login-form";
import { getSiteSettings, getActiveHeroBanner } from "@/lib/public-data";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  const [settings, hero] = await Promise.all([
    getSiteSettings(),
    getActiveHeroBanner(),
  ]);

  const schoolShortName = settings?.short_name || "HUSSS";
  const bannerImage = hero?.image_url || settings?.logo_url || null;

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      {/* Image banner side — hidden on small screens, full bleed on desktop */}
      <div className="relative hidden lg:block bg-husss-green-950 overflow-hidden">
        {bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-husss-green-950 via-husss-green-950/70 to-husss-green-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,168,0,0.18),transparent_55%)]" />

        <div className="relative h-full flex flex-col justify-end p-14 text-white">
          <span className="eyebrow text-husss-gold-400 mb-4">
            Administration
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight max-w-md">
            Manage the HUSSS website
          </h1>
          <p className="text-white/60 mt-4 max-w-sm leading-relaxed">
            Hero banners, news, staff, gallery, and every editable section —
            all from one dashboard built for HUSSS directors and staff.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 lg:items-start lg:text-left text-center">
            {settings?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt={schoolShortName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-husss-gold-500/50 mb-4"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-husss-green-950 flex items-center justify-center text-husss-gold-400 font-display font-semibold ring-2 ring-husss-gold-500/50 mb-4">
                {schoolShortName.slice(0, 4)}
              </div>
            )}
            <h2 className="font-display text-xl font-semibold text-husss-green-950">
              Admin Dashboard
            </h2>
            <p className="text-sm text-muted mt-1">
              Sign in to manage the school website
            </p>
          </div>

          <div className="card-hairline p-7">
            <LoginForm redirectTo={redirectTo || "/admin"} />
          </div>

          <p className="text-xs text-muted text-center lg:text-left mt-6">
            Access is restricted to authorized HUSSS directors and staff.
          </p>
        </div>
      </div>
    </div>
  );
}
