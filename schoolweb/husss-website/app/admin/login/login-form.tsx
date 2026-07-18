"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-husss-green-950 mb-1.5"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-gold-500/25 transition-colors"
          placeholder="director@husss.edu.et"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-husss-green-950 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-husss-green-600 focus:outline-none focus:ring-2 focus:ring-husss-gold-500/25 transition-colors"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-husss-green-950 text-white font-medium py-2.5 hover:bg-husss-green-900 transition-colors disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
