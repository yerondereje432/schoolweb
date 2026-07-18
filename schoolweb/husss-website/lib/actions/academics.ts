"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AcademicProgram = {
  id: string;
  grade_level: string;
  stream: string | null;
  title_en: string | null;
  description_en: string | null;
  subjects_en: string[] | null;
  sort_order: number;
};

export async function upsertProgram(data: Partial<AcademicProgram>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { error } = id
    ? await supabase.from("academic_programs").update(rest).eq("id", id)
    : await supabase.from("academic_programs").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  return { success: true };
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("academic_programs")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/academics");
  revalidatePath("/academics");
  return { success: true };
}
