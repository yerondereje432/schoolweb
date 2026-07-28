"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Trophy,
  Newspaper,
  GraduationCap,
  Users,
  Images,
  Phone,
  FileText,
  Star,
  Users2,
  LogOut,
  ShieldAlert,
  KeyRound,
  Menu,
  X
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Homepage & About",
    items: [
      { href: "/admin/hero", label: "Hero Banners", icon: ImageIcon },
      { href: "/admin/about", label: "Mission & About", icon: FileText },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/accomplishments", label: "Accomplishments", icon: Trophy },
      { href: "/admin/top-students", label: "Top Students (EUEE)", icon: Star },
      { href: "/admin/news", label: "News & Announcements", icon: Newspaper },
      { href: "/admin/academics", label: "Academics", icon: GraduationCap },
      { href: "/admin/staff", label: "Staff & Leadership", icon: Users },
      { href: "/admin/gallery", label: "Student Gallery", icon: Images },
    ],
  },
  {
    label: "Site Management",
    items: [
      { href: "/admin/contact", label: "Contact Info", icon: Phone },
      { href: "/admin/submissions", label: "Contact Submissions", icon: Phone },
      { href: "/admin/custom-pages", label: "Custom Pages", icon: FileText },
      { href: "/admin/settings", label: "Site Settings", icon: Settings },
      { href: "/admin/users", label: "Admin Users", icon: Users2 },
      { href: "/admin/audit-log", label: "Audit Log", icon: ShieldAlert },
      { href: "/admin/account", label: "My Account", icon: KeyRound },
    ],
  },
];

export default function AdminLayout({
  children,
  adminEmail = "admin@example.com", // Pass this via props if using Server Components wrapper
}: {
  children: React.ReactNode;
  adminEmail?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between bg-husss-green-950 text-white p-4 sticky top-0 z-50">
        <div>
          <p className="font-semibold text-sm tracking-wide">HUSSS ADMIN</p>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white/80 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} 
        md:flex 
        w-full md:w-64 shrink-0 bg-husss-green-950 text-white flex-col
        fixed md:sticky top-[60px] md:top-0 h-[calc(100vh-60px)] md:h-screen z-40
      `}>
        <div className="hidden md:block px-5 py-5 border-b border-white/10">
          <p className="font-semibold text-sm tracking-wide">HUSSS ADMIN</p>
          <p className="text-xs text-white/50 mt-0.5 truncate">{adminEmail}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 pb-24 md:pb-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[11px] uppercase tracking-wider text-white/40 font-medium">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <item.icon size={16} strokeWidth={2} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 mt-auto bg-husss-green-950">
          <form action={logoutAction}>
            <button className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:ml-0 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden top-[60px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
