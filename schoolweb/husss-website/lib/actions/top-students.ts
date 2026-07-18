"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TopStudent = {
  id: string;
  exam_year: number;
  rank: number;
  full_name: string;
  stream: string | null;
  score: string | null;
  photo_url: string | null;
  quote_en: string | null;
  quote_om: string | null;
  quote_am: string | null;
};

export async function upsertTopStudent(data: Partial<TopStudent>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { error } = id
    ? await supabase.from("top_students").update(rest).eq("id", id)
    : await supabase.from("top_students").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/top-students");
  revalidatePath("/accomplishments");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTopStudent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("top_students").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/top-students");
  revalidatePath("/accomplishments");
  return { success: true };
}
