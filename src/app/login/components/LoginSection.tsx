"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Label htmlFor="login-email">Email</Label>
          <Input
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
          <Label htmlFor="login-password">Password</Label>
          <Input
            type="password"
            name="password"
            id="login-password"
            value={password}
            onChange={onPasswordChange}
            autoComplete="current-password"
            required
          />
        </div>
        <Button className="w-full" onClick={onSubmit} disabled={isPending}>
          Log in
        </Button>
      </div>
    </section>
  );
}
