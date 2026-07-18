"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

export type AuthState = { error?: string } | null;

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for; take the first (client) address.
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "unknown";
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const ip = await getClientIp();

  // 5 attempts per 5 minutes per IP — enough for a genuine typo or two,
  // but stops scripted brute-force login attempts.
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password. Please try again." };
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
