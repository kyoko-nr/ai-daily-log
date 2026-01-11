"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Label htmlFor="signup-email">Email</Label>
          <Input
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
          <Label htmlFor="signup-password">Password</Label>
          <Input
            type="password"
            name="password"
            id="signup-password"
            value={password}
            onChange={onPasswordChange}
            autoComplete="new-password"
            required
          />
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={onSubmit}
          disabled={isPending}
        >
          Create account
        </Button>
      </div>
    </section>
  );
}
