"use client";

import { useSignupHooks } from "../hooks/useSignupHooks";

/** サインアップ入力フォームを表示する。 */
export default function SignupSection() {
  const {
    email,
    password,
    isPending,
    onEmailChange,
    onPasswordChange,
    onSubmit,
  } = useSignupHooks();
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Sign up</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Create a new account with your email.
      </p>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            htmlFor="signup-email"
          >
            Email
          </label>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
            type="email"
            name="email"
            id="signup-email"
            value={email}
            onChange={onEmailChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            htmlFor="signup-password"
          >
            Password
          </label>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
            type="password"
            name="password"
            id="signup-password"
            value={password}
            onChange={onPasswordChange}
            autoComplete="new-password"
            required
          />
        </div>
        <button
          className="w-full rounded-xl border border-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onSubmit}
          disabled={isPending}
        >
          Create account
        </button>
      </div>
    </section>
  );
}
