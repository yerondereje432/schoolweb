import { createClient } from "@/lib/supabase/server";
import SubmissionsClient from "./client";

export default async function SubmissionsAdminPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Contact Submissions
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Messages submitted through the public Contact page form.
      </p>

      <SubmissionsClient initialData={submissions || []} />
    </div>
  );
}
