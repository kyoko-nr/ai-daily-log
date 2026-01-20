import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/app/app/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getLogDetail } from "../hooks/getLogDetail";

type LogDetailPageProps = {
  params:
    | Promise<{
        logId: string;
      }>
    | {
        logId: string;
      };
};

/** 認証済みユーザー向けのログ詳細ページ。 */
export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const log = await getLogDetail({
    supabase,
    logId: resolvedParams.logId,
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {/* TODO: #10 - Implement delete and edit functionality */}
            <div className="flex items-center gap-2">
              <Button variant="destructive" disabled>
                削除
              </Button>
              <Button variant="outline" disabled>
                修正
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <div className="grid gap-2">
              <Label>日付</Label>
              <p className="text-sm text-zinc-700">{log.logDate}</p>
            </div>

            <div className="grid gap-2">
              <Label>ログ本文</Label>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">
                {log.logText}
              </p>
            </div>

            {log.followups.length > 0 && (
              <div className="grid gap-4">
                {log.followups.map((followup) => (
                  <div
                    key={followup.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <Label className="text-sm font-medium leading-6 text-zinc-900">
                      {followup.question}
                    </Label>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
                      {followup.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Button asChild variant="link" className="w-fit p-0">
          <Link href="/logs">一覧に戻る</Link>
        </Button>
      </main>
    </div>
  );
}
