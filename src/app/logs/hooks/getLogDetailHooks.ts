import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

const dailyLogRowSchema = z.object({
  id: z.uuid(),
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  log_text: z.string(),
});

type DailyLogRow = z.infer<typeof dailyLogRowSchema>;

const dailyLogFollowupRowSchema = z.object({
  id: z.uuid(),
  question: z.string(),
  answer: z.string(),
  created_at: z.string(),
});

type DailyLogFollowupRow = z.infer<typeof dailyLogFollowupRowSchema>;

/** ログ詳細ページで表示するフォローアップ質問/回答。 */
export type DailyLogDetailFollowup = Omit<DailyLogFollowupRow, "created_at">;

/** ログ詳細ページで表示する日次ログのデータ。 */
export type DailyLogDetail = Omit<DailyLogRow, "log_date" | "log_text"> & {
  logDate: DailyLogRow["log_date"];
  logText: DailyLogRow["log_text"];
  followups: DailyLogDetailFollowup[];
};

const logIdSchema = z.uuid();

/** ログ詳細ページの状態（対象ログとフォローアップ）を取得する。 */
export const getLogDetailHooks = async ({
  supabase,
  logId,
}: {
  supabase: SupabaseClient;
  logId: string;
}): Promise<DailyLogDetail> => {
  const parsedLogId = logIdSchema.safeParse(logId);

  if (!parsedLogId.success) {
    redirect("/logs");
  }

  const { data: logRow, error: logError } = await supabase
    .from("daily_logs")
    .select("id, log_date, log_text")
    .eq("id", parsedLogId.data)
    .maybeSingle();

  if (logError) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to load log"
        : `Failed to load log: ${logError.message}`;
    throw new Error(message);
  }

  if (!logRow) {
    redirect("/logs");
  }

  const parsedLogRow = dailyLogRowSchema.safeParse(logRow);

  if (!parsedLogRow.success) {
    throw new Error("Failed to load log");
  }

  const resolvedLogRow: DailyLogRow = parsedLogRow.data;
  const { data: followupRows, error: followupError } = await supabase
    .from("daily_log_followups")
    .select("id, question, answer, created_at")
    .eq("log_id", resolvedLogRow.id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (followupError) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to load followups"
        : `Failed to load followups: ${followupError.message}`;
    throw new Error(message);
  }

  const parsedFollowupRows = z
    .array(dailyLogFollowupRowSchema)
    .safeParse(followupRows ?? []);

  if (!parsedFollowupRows.success) {
    throw new Error("Failed to load followups");
  }

  const resolvedFollowupRows: DailyLogFollowupRow[] = parsedFollowupRows.data;
  const followups = resolvedFollowupRows.map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
  }));

  return {
    id: resolvedLogRow.id,
    logDate: resolvedLogRow.log_date,
    logText: resolvedLogRow.log_text,
    followups,
  };
};
