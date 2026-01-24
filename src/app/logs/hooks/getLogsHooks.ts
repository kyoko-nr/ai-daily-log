import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentYearMonth, shiftMonth, toMonthRange } from "@/lib/date";
import {
  type DailyLogListItem,
  dailyLogListResponseSchema,
} from "@/lib/schemas/dailyLogSchemas";

type DailyLogRow = {
  id: string;
  log_date: string;
  log_text: string;
  created_at: string;
};

const yearMonthSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => /^\d{4}-\d{2}$/.test(value))
  .transform((value) => `${value}-01`)
  .pipe(z.iso.date())
  .transform((value) => value.slice(0, 7));

const resolveYearMonth = (yearMonth: string | string[] | undefined) => {
  if (!yearMonth) {
    return getCurrentYearMonth();
  }

  if (Array.isArray(yearMonth)) {
    return null;
  }

  const parsedYearMonth = yearMonthSchema.safeParse(yearMonth);
  return parsedYearMonth.success ? parsedYearMonth.data : null;
};

/** 過去ログ一覧ページの状態（対象月やログ一覧）を取得する。 */
export const getLogsHooks = async ({
  supabase,
  yearMonth,
}: {
  supabase: SupabaseClient;
  yearMonth: string | string[] | undefined;
}): Promise<{
  yearMonth: string;
  monthLabel: string;
  logs: DailyLogListItem[];
  previousMonthHref: string;
  nextMonthHref: string;
}> => {
  const resolvedYearMonth = resolveYearMonth(yearMonth);

  if (!resolvedYearMonth) {
    redirect("/logs");
  }

  const { data, error } = await supabase.rpc("list_daily_logs_by_year_month", {
    p_year_month: resolvedYearMonth,
  });

  if (error) {
    const shouldFallback =
      error.code === "22023" && error.message.includes("Invalid yearMonth");

    if (!shouldFallback) {
      console.error("Failed to load logs:", error);
      throw new Error("Failed to load logs");
    }

    const { startDate, endDate } = toMonthRange(resolvedYearMonth);
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("daily_logs")
      .select("id, log_date, log_text, created_at")
      .gte("log_date", startDate)
      .lt("log_date", endDate)
      .order("log_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (fallbackError) {
      console.error("Failed to load logs:", fallbackError);
      throw new Error("Failed to load logs");
    }

    const rows = (fallbackData ?? []) as DailyLogRow[];
    const logs = rows.map((row) => ({
      id: row.id,
      logDate: row.log_date,
      logText: row.log_text,
    }));

    const validatedLogs = dailyLogListResponseSchema.parse({ logs }).logs;
    const previousMonth = shiftMonth(resolvedYearMonth, -1);
    const nextMonth = shiftMonth(resolvedYearMonth, 1);
    const [year, month] = resolvedYearMonth.split("-");

    return {
      yearMonth: resolvedYearMonth,
      monthLabel: `${year}年${month}月`,
      logs: validatedLogs,
      previousMonthHref: `/logs?yearMonth=${encodeURIComponent(previousMonth)}`,
      nextMonthHref: `/logs?yearMonth=${encodeURIComponent(nextMonth)}`,
    };
  }

  const rows = (data ?? []) as DailyLogRow[];
  const logs = rows.map((row) => ({
    id: row.id,
    logDate: row.log_date,
    logText: row.log_text,
  }));

  const validatedLogs = dailyLogListResponseSchema.parse({ logs }).logs;
  const previousMonth = shiftMonth(resolvedYearMonth, -1);
  const nextMonth = shiftMonth(resolvedYearMonth, 1);
  const [year, month] = resolvedYearMonth.split("-");

  return {
    yearMonth: resolvedYearMonth,
    monthLabel: `${year}年${month}月`,
    logs: validatedLogs,
    previousMonthHref: `/logs?yearMonth=${encodeURIComponent(previousMonth)}`,
    nextMonthHref: `/logs?yearMonth=${encodeURIComponent(nextMonth)}`,
  };
};
