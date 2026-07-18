import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./client";

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Site Settings
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Global site name variants, logo, footer text, and brand colors.
      </p>

      <SettingsClient initialData={data} />
    </div>
  );
}
