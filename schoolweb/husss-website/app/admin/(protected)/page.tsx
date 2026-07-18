import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Newspaper, Trophy, Users, Images, Mail } from "lucide-react";

export default async function AdminHomePage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: newsCount },
    { count: accomplishmentsCount },
    { count: staffCount },
    { count: galleryCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from("news_posts").select("*", { count: "exact", head: true }),
    supabase.from("accomplishments").select("*", { count: "exact", head: true }),
    supabase.from("staff_members").select("*", { count: "exact", head: true }),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const cards = [
    { label: "News posts", value: newsCount ?? 0, href: "/admin/news", icon: Newspaper },
    { label: "Accomplishments", value: accomplishmentsCount ?? 0, href: "/admin/accomplishments", icon: Trophy },
    { label: "Staff members", value: staffCount ?? 0, href: "/admin/staff", icon: Users },
    { label: "Gallery photos", value: galleryCount ?? 0, href: "/admin/gallery", icon: Images },
    { label: "Unread messages", value: unreadCount ?? 0, href: "/admin/submissions", icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Welcome, {admin.full_name || admin.email}
      </h1>
      <p className="text-gray-500 mt-1 mb-8">
        Manage everything on the HUSSS public website from here.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-husss-green-300 hover:shadow-md transition-all"
          >
            <card.icon className="text-husss-green-600 mb-3" size={22} />
            <p className="text-2xl font-semibold text-husss-green-950">
              {card.value}
            </p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-husss-green-50 border border-husss-green-100 rounded-xl p-5">
        <p className="text-sm text-husss-green-900">
          <strong>Tip:</strong> Any content you edit here — hero banners, news,
          accomplishments, staff, gallery photos, contact details — updates the
          public website immediately. Use <strong>Custom Pages</strong> to add
          a whole new section (e.g. Alumni, Events) without needing a
          developer.
        </p>
      </div>
    </div>
  );
}
