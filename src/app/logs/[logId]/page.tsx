import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LogDetailPageProps = {
  params:
    | Promise<{
        logId: string;
      }>
    | {
        logId: string;
      };
};

/** ログ詳細ページ（TODO）。 */
export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Logs
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">ログ詳細</h1>
          <p className="text-sm text-zinc-500">
            TODO: 詳細ページは後で実装します。
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <p className="text-sm text-zinc-700">logId: {resolvedParams.logId}</p>
        </section>

        <Button asChild variant="link" className="w-fit p-0">
          <Link href="/logs">一覧に戻る</Link>
        </Button>
      </main>
    </div>
  );
}
