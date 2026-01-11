"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNoticeHooks } from "../hooks/useNoticeHooks";
import LoginSection from "./LoginSection";
import ResetSection from "./ResetSection";
import SignupSection from "./SignupSection";

/** ログイン/サインアップ/リセット操作を行うクライアント UI。 */
export default function LoginClient() {
  const { notice } = useNoticeHooks();

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            AI Daily Log
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to continue
          </h1>
          <p className="max-w-xl text-base text-zinc-600">
            Use your email and password to access your daily log. New here?
            Create an account in seconds.
          </p>
        </header>

        {notice && (
          <Alert variant={notice.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{notice.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <LoginSection />
          <SignupSection />
          <ResetSection />
        </div>
      </main>
    </div>
  );
}
