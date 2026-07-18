import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "super_admin" | "editor";
};

/**
 * Gets the current logged-in admin's profile. Redirects to login if not
 * authenticated, and to a "no access" page if authenticated but not yet
 * provisioned as an admin (e.g. a Supabase auth user without an
 * admin_profiles row).
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/admin/no-access");
  }

  return profile as AdminProfile;
}
