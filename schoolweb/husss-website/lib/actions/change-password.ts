"use server";

import { createClient } from "@/lib/supabase/server";

export type ChangePasswordState = { error?: string; success?: boolean } | null;

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("current_password") || "");
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Please fill in all fields." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation don't match." };
  }

  // Basic strength requirements enforced here since Supabase's built-in
  // leaked-password check (HaveIBeenPwned) requires a paid plan we're not
  // on. This is an app-level substitute, not a replacement for that check.
  if (newPassword.length < 10) {
    return { error: "New password must be at least 10 characters." };
  }
  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return {
      error:
        "New password must include an uppercase letter, a lowercase letter, and a number.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Not authenticated." };
  }

  // Verify the current password is correct before allowing a change, by
  // attempting to sign in with it. This prevents someone with a hijacked
  // but still-active session from silently locking out the real owner.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
