import { createClient } from "@/lib/supabase/server";
import ContactClient from "./client";

export default async function ContactAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-husss-green-950">
        Contact Information
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Address, phone, email, map coordinates, and social links shown on the
        public Contact page and site footer.
      </p>

      <ContactClient initialData={data} />
    </div>
  );
}
