"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Accomplishment = {
  id: string;
  title_en: string;
  title_om: string | null;
  title_am: string | null;
  description_en: string | null;
  description_om: string | null;
  description_am: string | null;
  category: string;
  stat_value: string | null;
  stat_label_en: string | null;
  stat_label_om: string | null;
  stat_label_am: string | null;
  year: number | null;
  image_url: string | null;
  sort_order: number;
  is_featured: boolean;
};

export async function upsertAccomplishment(data: Partial<Accomplishment>) {
  const supabase = await createClient();
  const { id, ...rest } = data;

  const { error } = id
    ? await supabase.from("accomplishments").update(rest).eq("id", id)
    : await supabase.from("accomplishments").insert(rest);

  if (error) return { error: error.message };

  revalidatePath("/admin/accomplishments");
  revalidatePath("/accomplishments");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAccomplishment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accomplishments").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/accomplishments");
  revalidatePath("/accomplishments");
  revalidatePath("/");
  return { success: true };
}

export async function reorderAccomplishments(
  orderedIds: { id: string; sort_order: number }[]
) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map(({ id, sort_order }) =>
      supabase.from("accomplishments").update({ sort_order }).eq("id", id)
    )
  );
  revalidatePath("/admin/accomplishments");
  revalidatePath("/accomplishments");
  return { success: true };
}
