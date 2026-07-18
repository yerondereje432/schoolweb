import { createClient } from "@/lib/supabase/server";
import HeroClient from "./client";

export default async function HeroAdminPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("hero_banners")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Homepage Hero Banners
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        The rotating banner(s) shown at the top of the homepage. Add one or
        more — if more than one is active, they rotate.
      </p>

      <HeroClient initialData={banners || []} />
    </div>
  );
}
