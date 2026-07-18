"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ContactInfo = {
  address_en: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  email_primary: string | null;
  email_secondary: string | null;
  map_lat: number | null;
  map_lng: number | null;
  facebook_url: string | null;
  telegram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  x_url: string | null;
};

export async function updateContactInfo(data: Partial<ContactInfo>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_info")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/contact");
  revalidatePath("/contact");
  revalidatePath("/");
  return { success: true };
}

export async function markSubmissionRead(id: string, isRead: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/submissions");
  return { success: true };
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/submissions");
  return { success: true };
}
