"use client";

import Link from "next/link";

import type { DailyLogListItem } from "@/lib/schemas/dailyLogSchemas";

type LogListItemProps = {
  log: DailyLogListItem;
};

/** 過去ログ一覧の 1 件分を表示する。 */
export default function LogListItem({ log }: LogListItemProps) {
  return (
    <li>
      <Link
        className="block rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:bg-zinc-50"
        href={`/logs/${log.id}`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-zinc-900">{log.logDate}</p>
          <p className="truncate text-sm text-zinc-600">{log.logText}</p>
        </div>
      </Link>
    </li>
  );
}
