"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Label htmlFor="reset-email">Email</Label>
          <Input
            type="email"
            name="email"
            id="reset-email"
            value={email}
            onChange={onEmailChange}
            autoComplete="email"
            required
          />
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={onSubmit}
          disabled={isPending}
        >
          Send reset link
        </Button>
      </div>
    </section>
  );
}
