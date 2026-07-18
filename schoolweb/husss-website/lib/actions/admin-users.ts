"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "super_admin" | "editor";
};

/**
 * Invites a new admin by creating a Supabase auth user (with a temporary
 * password they'll be asked to change, or via magic link) and a matching
 * admin_profiles row. Requires the service role key.
 */
export async function inviteAdminUser(input: {
  email: string;
  full_name: string;
  role: "super_admin" | "editor";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: requester } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!requester) return { error: "Not authorized." };
  if (requester.role !== "super_admin") {
    return { error: "Only super admins can invite new admins." };
  }

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch {
    return {
      error:
        "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it in your environment variables to enable inviting new admins.",
    };
  }

  const { data: created, error: createError } =
    await adminClient.auth.admin.inviteUserByEmail(input.email);

  if (createError || !created.user) {
    return { error: createError?.message || "Failed to invite user." };
  }

  const { error: profileError } = await adminClient
    .from("admin_profiles")
    .insert({
      id: created.user.id,
      email: input.email,
      full_name: input.full_name,
      role: input.role,
    });

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/users");
  return { success: true };
}

async function requireSuperAdmin(): Promise<{ error?: string; userId?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: requester } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!requester || requester.role !== "super_admin") {
    return { error: "Only super admins can manage other admin accounts." };
  }
  return { userId: user.id };
}

export async function removeAdminUser(id: string) {
  const check = await requireSuperAdmin();
  if (check.error) return { error: check.error };
  if (id === check.userId) {
    return { error: "You can't remove your own admin access." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("admin_profiles").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateAdminRole(
  id: string,
  role: "super_admin" | "editor"
) {
  const check = await requireSuperAdmin();
  if (check.error) return { error: check.error };
  if (id === check.userId && role !== "super_admin") {
    return { error: "You can't demote your own account." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_profiles")
    .update({ role })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}
