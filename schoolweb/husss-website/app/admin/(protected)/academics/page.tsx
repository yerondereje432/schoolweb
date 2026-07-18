import { createClient } from "@/lib/supabase/server";
import AcademicsClient from "./client";

export default async function AcademicsAdminPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("academic_programs")
    .select("*")
    .order("grade_level")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Academics
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Grade levels, streams, and subjects offered — shown on the public
        Academics page.
      </p>

      <AcademicsClient initialData={programs || []} />
    </div>
  );
}
