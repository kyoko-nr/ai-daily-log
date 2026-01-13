import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

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

const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");

  return `${year}-${month}`;
};

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

const shiftMonth = (yearMonth: string, delta: number) => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const targetMonth = new Date(Date.UTC(year, month - 1, 1));

  targetMonth.setUTCMonth(targetMonth.getUTCMonth() + delta);

  const shiftedYear = targetMonth.getUTCFullYear();
  const shiftedMonth = `${targetMonth.getUTCMonth() + 1}`.padStart(2, "0");
  return `${shiftedYear}-${shiftedMonth}`;
};

const toMonthRange = (yearMonth: string) => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
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
      const message =
        process.env.NODE_ENV === "production"
          ? "Failed to load logs"
          : `Failed to load logs: ${error.message}`;
      throw new Error(message);
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
      const message =
        process.env.NODE_ENV === "production"
          ? "Failed to load logs"
          : `Failed to load logs: ${fallbackError.message}`;
      throw new Error(message);
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
