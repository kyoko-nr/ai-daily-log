"use client";

import { useLoginHooks } from "../hooks/useLoginHooks";

/** ログイン入力フォームを表示する。 */
export default function LoginSection() {
  const {
    email,
    password,
    isPending,
    onEmailChange,
    onPasswordChange,
    onSubmit,
  } = useLoginHooks();
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Log in</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Welcome back. Enter your credentials.
      </p>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
            type="email"
            name="email"
            id="login-email"
            value={email}
            onChange={onEmailChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            htmlFor="login-password"
          >
            Password
          </label>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
            type="password"
            name="password"
            id="login-password"
            value={password}
            onChange={onPasswordChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onSubmit}
          disabled={isPending}
        >
          Log in
        </button>
      </div>
    </section>
  );
}
