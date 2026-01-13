import { redirect } from "next/navigation";

import LogoutButton from "@/app/app/components/LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import LogsView from "./components/LogsView";
import { getLogsHooks } from "./hooks/getLogsHooks";

type LogsPageProps = {
  searchParams?:
    | Promise<{
        yearMonth?: string | string[];
      }>
    | {
        yearMonth?: string | string[];
      };
};

/** 認証済みユーザー向けの過去ログ一覧ページ。 */
export default async function LogsPage({ searchParams }: LogsPageProps) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const { monthLabel, logs, previousMonthHref, nextMonthHref } =
    await getLogsHooks({
      supabase,
      yearMonth: resolvedSearchParams?.yearMonth,
    });

  return (
    <div className="min-h-screen bg-white px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
              AI Daily Log
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Logs</h1>
            <p className="text-base text-zinc-600">
              Signed in as {data.user.email ?? "unknown"}
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <LogsView
            monthLabel={monthLabel}
            logs={logs}
            previousMonthHref={previousMonthHref}
            nextMonthHref={nextMonthHref}
          />
        </section>
      </main>
    </div>
  );
}
