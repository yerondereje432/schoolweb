import { createClient } from "@/lib/supabase/server";
import AccomplishmentsClient from "./client";

export default async function AccomplishmentsAdminPage() {
  const supabase = await createClient();
  const { data: accomplishments } = await supabase
    .from("accomplishments")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Accomplishments
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Exam results, awards, rankings, and recognitions shown on the public
        Accomplishments page.
      </p>

      <AccomplishmentsClient initialData={accomplishments || []} />
    </div>
  );
}
