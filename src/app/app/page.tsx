import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DailyLogForm from "./components/DailyLogForm";
import LogoutButton from "./components/LogoutButton";

/** 認証済みユーザー向けのアプリ画面。 */
export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
              AI Daily Log
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-base text-zinc-600">
              Signed in as {data.user.email ?? "unknown"}
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <DailyLogForm />
        </section>
      </main>
    </div>
  );
}
