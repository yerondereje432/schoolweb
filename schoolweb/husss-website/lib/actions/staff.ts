"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StaffMember = {
  id: string;
  full_name: string;
  role_en: string;
  role_om: string | null;
  role_am: string | null;
  bio_en: string | null;
  bio_om: string | null;
  bio_am: string | null;
  photo_url: string | null;
  department: string | null;
  is_leadership: boolean;
  sort_order: number;
};

export async function upsertStaffMember(data: Partial<StaffMember>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { error } = id
    ? await supabase.from("staff_members").update(rest).eq("id", id)
    : await supabase.from("staff_members").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/staff");
  revalidatePath("/staff");
  revalidatePath("/");
  return { success: true };
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("staff_members").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/staff");
  revalidatePath("/staff");
  return { success: true };
}
