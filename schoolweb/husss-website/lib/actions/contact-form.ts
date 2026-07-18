"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactFormState = { error?: string; success?: boolean } | null;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "unknown";
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ip = await getClientIp();

  // 3 submissions per 10 minutes per IP — generous for a real visitor,
  // restrictive enough to stop spam floods. The database also enforces a
  // 60-second-per-email cooldown as a second layer.
  const rateLimit = checkRateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      error: `Too many messages sent. Please try again in a few minutes.`,
    };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email, and message." };
  }

  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return { error: "One of your fields is too long. Please shorten it." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  });

  if (error) {
    // The database's own rate-limit trigger surfaces here too if the same
    // email submits twice within 60 seconds.
    if (error.message.includes("wait a moment")) {
      return { error: "Please wait a moment before sending another message." };
    }
    return { error: "Something went wrong. Please try again shortly." };
  }

  return { success: true };
}
