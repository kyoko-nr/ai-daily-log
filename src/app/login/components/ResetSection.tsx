"use client";

import { useResetHooks } from "../hooks/useResetHooks";

/** パスワードリセット入力フォームを表示する。 */
export default function ResetSection() {
  const { email, isPending, onEmailChange, onSubmit } = useResetHooks();
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Reset password</h2>
      <p className="mt-2 text-sm text-zinc-600">
        We will email a reset link to you.
      </p>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            htmlFor="reset-email"
          >
            Email
          </label>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
            type="email"
            name="email"
            id="reset-email"
            value={email}
            onChange={onEmailChange}
            autoComplete="email"
            required
          />
        </div>
        <button
          className="w-full rounded-xl border border-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onSubmit}
          disabled={isPending}
        >
          Send reset link
        </button>
      </div>
    </section>
  );
}
