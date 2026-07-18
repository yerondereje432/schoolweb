# HUSSS Website

Official website for **Haramaya University Special Non-Boarding Secondary School (HUSSS)** — Grades 9–12, Haramaya, Ethiopia.

Built with Next.js (App Router) + Supabase (Postgres, Auth, Storage). Trilingual-ready (English / Afaan Oromo / Amharic). Fully editable by non-technical directors through `/admin`.

---

## 1. What's already set up

- **Supabase project**: `husss-website` (ref: `cxpgjjvteaqzhnpwkqzl`, region `eu-central-1`) — schema, Row Level Security, and a public storage bucket (`husss-media`) are already created.
- **First admin account** (super admin):
  - Email: `yerondereje432@gmail.com`
  - Temporary password: `Husss2026!Temp`
  - **Change this password immediately after your first login** — go to `/admin`, or use Supabase's dashboard (Authentication → Users → this user → "Send password recovery").

---

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development, or set these in Vercel's Project Settings → Environment Variables for production:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` secret key. **Server-only — never expose this to the browser.** Required for inviting new admin users. |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL, e.g. `https://husss.vercel.app` |

---

## 3. Deploying to Vercel

1. Push this code to a GitHub repository (private is fine).
2. In Vercel: **Add New → Project → Import** your repository.
3. Framework preset: **Next.js** (auto-detected, no config changes needed).
4. Add the four environment variables above under **Environment Variables**.
5. Click **Deploy**.
6. Once live, visit `https://<your-project>.vercel.app/admin/login` and sign in with the admin account above.

No further configuration is needed — Supabase Storage handles all image uploads, so there's no local file storage to worry about on Vercel's serverless environment.

---

## 4. How directors log into `/admin`

1. Go to `https://<your-site>/admin/login`.
2. Enter the email and password given to you (see above, or ask a super admin to invite you — see below).
3. You'll land on the admin dashboard with a sidebar covering every editable section: Hero Banners, Mission & About, Accomplishments, Top Students (EUEE), News, Academics, Staff, Gallery, Contact Info, Custom Pages, Site Settings, and Admin Users.
4. Any change saved in `/admin` reflects on the public site within seconds.

### Roles
- **Super Admin**: can edit all content *and* manage other admin accounts.
- **Editor**: can edit all content, but cannot add/remove other admins.

---

## 5. How to add a new admin user

1. Log in as a **super admin**.
2. Go to **Admin → Admin Users**.
3. Click **Invite Admin**, enter their name, email, and role.
4. They'll receive an email invite to set their password and sign in. (This requires `SUPABASE_SERVICE_ROLE_KEY` to be set in your environment — see section 2.)

---

## 6. Adding a brand-new page without a developer

Go to **Admin → Custom Pages → New Custom Page**. Give it a title, then add content using blocks:

- **Text** — heading + paragraph
- **Image** — single photo with caption
- **Image Gallery** — a grid of photos
- **Stats Grid** — number + label tiles (e.g. "98% — Pass Rate")
- **Button** — a call-to-action link
- **Video Embed** — a YouTube or other embeddable video

Reorder blocks with the up/down arrows, toggle **Published** and **Show in navigation menu**, then save. The page appears live at `/p/<your-slug>` and in the site's main navigation if enabled.

---

## 7. Seeding real photos

Nine real photos of HUSSS (computer lab sessions, exam halls, graduation, staff briefing, awards ceremony) were provided during development but were **not yet uploaded** to Supabase Storage due to a sandboxed build environment's network restrictions. To add them:

1. Log into `/admin`.
2. Go to **Gallery** (or **Accomplishments**, **Hero Banners**, etc. as appropriate) and use the built-in image uploader — it uploads directly to Supabase Storage.
3. Re-upload from your own copies of the original photos.

Photos of the Director (Ahmed Dedo), Vice-Director (Burqa Gutema), and the Top 3 EUEE students per year are intentionally left blank pending consent — upload them the same way once you have permission.

---

## 8. Tech stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Database / Auth / Storage**: Supabase (Postgres + Row Level Security, Supabase Auth, Supabase Storage)
- **Styling**: Tailwind CSS v4, design tokens derived from the HUSSS logo (deep green `#1E7B34`, gold `#F5A800`)
- **Fonts**: Inter (Latin / Afaan Oromo Qubee script), Noto Sans Ethiopic (Amharic Ge'ez script)
- **Icons**: lucide-react

---

## 9. Project structure

```
app/
  (public)/          Public-facing site (home, about, news, gallery, etc.)
  admin/
    login/            Admin login page
    no-access/        Shown to authenticated users without admin access
    (protected)/      All admin CRUD screens, behind auth middleware
lib/
  actions/            Server actions (one file per content type)
  supabase/           Supabase client factories (browser, server, admin)
  auth.ts             requireAdmin() helper
  public-data.ts       Shared data fetchers for public pages
components/
  admin/              Shared admin UI (image uploader)
  public/             Shared public UI (header, footer, contact form)
middleware.ts          Route protection for /admin/*
```
