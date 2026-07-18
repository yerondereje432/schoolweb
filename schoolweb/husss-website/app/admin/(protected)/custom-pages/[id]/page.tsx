import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlockEditorClient from "./client";

export default async function CustomPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: page }, { data: blocks }] = await Promise.all([
    supabase.from("custom_pages").select("*").eq("id", id).single(),
    supabase
      .from("custom_page_blocks")
      .select("*")
      .eq("page_id", id)
      .order("sort_order"),
  ]);

  if (!page) notFound();

  return (
    <div>
      <BlockEditorClient page={page} initialBlocks={blocks || []} />
    </div>
  );
}
