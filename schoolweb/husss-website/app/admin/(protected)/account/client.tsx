"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/lib/actions/change-password";
import { Check } from "lucide-react";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    null
  );

  if (state?.success) {
    return (
      <div className="text-sm text-husss-green-700 bg-husss-green-50 border border-husss-green-200 rounded-lg px-3 py-3 flex items-center gap-2">
        <Check size={16} /> Password changed successfully.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-husss-green-900 mb-1">
          Current password
        </label>
        <input
          type="password"
          name="current_password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-husss-green-900 mb-1">
          New password
        </label>
        <input
          type="password"
          name="new_password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          At least 10 characters, with an uppercase letter, lowercase letter,
          and a number.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-husss-green-900 mb-1">
          Confirm new password
        </label>
        <input
          type="password"
          name="confirm_password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
        className="w-full rounded-lg bg-husss-green-600 text-white font-medium py-2.5 text-sm hover:bg-husss-green-700 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
