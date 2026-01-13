import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { DailyLogListItem } from "@/lib/schemas/dailyLogSchemas";

import LogListItem from "./LogListItem";

type LogsViewProps = {
  monthLabel: string;
  logs: DailyLogListItem[];
  previousMonthHref: string;
  nextMonthHref: string;
};

/** 過去ログ一覧ページの UI を表示する。 */
export default function LogsView({
  monthLabel,
  logs,
  previousMonthHref,
  nextMonthHref,
}: LogsViewProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Logs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">過去ログ</h2>
          <p className="text-sm text-zinc-500">{monthLabel} のログ一覧です。</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={previousMonthHref}>前の月</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={nextMonthHref}>次の月</Link>
          </Button>
        </div>
      </div>

      {logs.length === 0 && (
        <p className="text-sm text-zinc-500">この月のログはありません。</p>
      )}

      {logs.length > 0 && (
        <ul className="space-y-3">
          {logs.map((log) => (
            <LogListItem key={log.id} log={log} />
          ))}
        </ul>
      )}
    </section>
  );
}
