import { createClient } from "@/lib/supabase/server";
import TopStudentsClient from "./client";

export default async function TopStudentsAdminPage() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("top_students")
    .select("*")
    .order("exam_year", { ascending: false })
    .order("rank", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Top Students — EUEE Grade 12
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Top 3 scorers of the Ethiopian University Entrance Examination, by
        year, starting 2024/2025. Add names and photos as they become
        available — leave photo empty until you have consent to publish it.
      </p>

      <TopStudentsClient initialData={students || []} />
    </div>
  );
}
