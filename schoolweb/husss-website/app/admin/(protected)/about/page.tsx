import { createClient } from "@/lib/supabase/server";
import AboutClient from "./client";

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("about_content")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Mission, Vision & About
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        This content appears on the public About Us page. Fill in each
        language you support — English is required.
      </p>

      <AboutClient initialData={data} />
    </div>
  );
}
