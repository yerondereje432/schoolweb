import { createClient } from "@/lib/supabase/server";
import CustomPagesClient from "./client";

export default async function CustomPagesAdminPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("custom_pages")
    .select("*")
    .order("nav_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Custom Pages
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Add a whole new page to the website — e.g. Alumni, Events, Downloads —
        without needing a developer. Build it from text, image, gallery,
        stats, and button blocks, then publish.
      </p>

      <CustomPagesClient initialPages={pages || []} />
    </div>
  );
}
