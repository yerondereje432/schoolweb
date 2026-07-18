import { createClient } from "@/lib/supabase/server";
import StaffClient from "./client";

export default async function StaffAdminPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff_members")
    .select("*")
    .order("is_leadership", { ascending: false })
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Staff & Leadership
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Directors, vice-directors, teachers, and administration shown on the
        public Staff & Leadership page.
      </p>

      <StaffClient initialData={staff || []} />
    </div>
  );
}
