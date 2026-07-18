"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact-form";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );

  if (state?.success) {
    return (
      <div className="bg-husss-green-50 border border-husss-green-200 rounded-xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-husss-green-600 mb-3" size={32} />
        <p className="font-medium text-husss-green-950">Message sent</p>
        <p className="text-sm text-gray-500 mt-1">
          Thank you for reaching out — we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-husss-green-900 mb-1">
            Your name *
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-green-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-husss-green-900 mb-1">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-husss-green-900 mb-1">
            Phone (optional)
          </label>
          <input
            name="phone"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-green-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-husss-green-900 mb-1">
            Subject
          </label>
          <input
            name="subject"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-green-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-husss-green-900 mb-1">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-green-100"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-husss-green-600 text-white font-medium px-5 py-2.5 text-sm hover:bg-husss-green-700 disabled:opacity-60"
      >
        <Send size={15} /> {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
