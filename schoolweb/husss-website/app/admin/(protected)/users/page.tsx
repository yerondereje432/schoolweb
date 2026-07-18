import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import UsersClient from "./client";

export default async function UsersAdminPage() {
  const currentAdmin = await requireAdmin();
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("email");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Admin Users
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Manage who can log into the HUSSS admin dashboard.{" "}
        <strong>Super admins</strong> can manage other admins;{" "}
        <strong>editors</strong> can edit content only.
      </p>

      <UsersClient initialData={users || []} currentUserId={currentAdmin.id} />
    </div>
  );
}
