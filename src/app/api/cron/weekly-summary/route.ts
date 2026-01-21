import type { Agent } from "@mastra/core/agent";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { mastra } from "@/mastra";

// ============================================================================
// 型定義
// ============================================================================

interface Followup {
  question: string;
  answer: string;
}

interface LogWithFollowups {
  log_id: string;
  log_date: string;
  log_text: string;
  followups: Followup[];
}

interface UserForSummary {
  user_id: string;
  log_count: number;
}

interface SummaryResult {
  userId: string;
  success: boolean;
  error?: string;
}

// ============================================================================
// 型ガード
// ============================================================================

/** UserForSummary 配列かどうかを検証する型ガード。 */
const isUserForSummaryArray = (data: unknown): data is UserForSummary[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "user_id" in item &&
        "log_count" in item,
    )
  );
};

/** LogWithFollowups 配列かどうかを検証する型ガード。 */
const isLogWithFollowupsArray = (data: unknown): data is LogWithFollowups[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "log_id" in item &&
        "log_date" in item &&
        "log_text" in item &&
        "followups" in item,
    )
  );
};

// ============================================================================
// ユーティリティ関数
// ============================================================================

/** 前週の月曜日を取得する（イミュータブル）。 */
const getLastWeekMonday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysToLastMonday = daysToMonday + 7;
  const lastMonday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysToLastMonday,
  );

  return lastMonday.toISOString().split("T")[0];
};

/** ログデータをプロンプト用のテキストに整形する。 */
const formatLogsForPrompt = (logs: LogWithFollowups[]): string => {
  return logs
    .map((log) => {
      const followupsText =
        log.followups.length > 0
          ? log.followups
              .map(
                (f) => `  Q: ${f.question}\n  A: ${f.answer || "（未回答）"}`,
              )
              .join("\n")
          : "  （フォローアップなし）";

      return `### ${log.log_date}\n${log.log_text}\n\n#### フォローアップ\n${followupsText}`;
    })
    .join("\n\n---\n\n");
};

// ============================================================================
// 認証・データ取得
// ============================================================================

/** Cron シークレットを検証する。 */
const verifyCronSecret = (request: Request): boolean => {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
};

/** サマリー対象ユーザーを取得する。 */
const fetchEligibleUsers = async (
  supabase: SupabaseClient,
  weekStart: string,
): Promise<{ users: UserForSummary[] | null; error: string | null }> => {
  const { data, error } = await supabase.rpc("get_users_for_weekly_summary", {
    p_week_start: weekStart,
  });

  if (error) {
    console.error("Failed to get users for weekly summary:", error);
    return { users: null, error: "Failed to get users" };
  }

  if (!isUserForSummaryArray(data) || data.length === 0) {
    return { users: null, error: null };
  }

  return { users: data, error: null };
};

// ============================================================================
// サマリー生成
// ============================================================================

/** 単一ユーザーのサマリーを生成する。 */
const generateSummaryForUser = async (
  supabase: SupabaseClient,
  agent: Agent,
  user: UserForSummary,
  weekStart: string,
): Promise<SummaryResult> => {
  // ユーザーの週次ログを取得
  const { data: logsData, error: logsError } = await supabase.rpc(
    "get_weekly_logs_with_followups",
    { p_user_id: user.user_id, p_week_start: weekStart },
  );

  if (
    logsError ||
    !isLogWithFollowupsArray(logsData) ||
    logsData.length === 0
  ) {
    return {
      userId: user.user_id,
      success: false,
      error: "Failed to get logs",
    };
  }

  // AI でサマリーを生成
  const logsText = formatLogsForPrompt(logsData);
  const prompt = `以下は${weekStart}の週（月曜〜日曜）の活動ログです。これを基に週次サマリーを作成してください。\n\n${logsText}`;
  const response = await agent.generate(prompt);
  const summaryText = typeof response.text === "string" ? response.text : "";

  if (!summaryText) {
    return {
      userId: user.user_id,
      success: false,
      error: "Empty summary generated",
    };
  }

  // サマリーを保存
  const { error: insertError } = await supabase.from("weekly_summaries").upsert(
    {
      user_id: user.user_id,
      week_start: weekStart,
      summary_text: summaryText,
      log_count: user.log_count,
    },
    { onConflict: "user_id,week_start" },
  );

  if (insertError) {
    return { userId: user.user_id, success: false, error: insertError.message };
  }

  return { userId: user.user_id, success: true };
};

/** 全ユーザーのサマリーを生成する。 */
const generateSummariesForAllUsers = async (
  supabase: SupabaseClient,
  agent: Agent,
  users: UserForSummary[],
  weekStart: string,
): Promise<SummaryResult[]> => {
  const results: SummaryResult[] = [];

  for (const user of users) {
    try {
      const result = await generateSummaryForUser(
        supabase,
        agent,
        user,
        weekStart,
      );
      results.push(result);
    } catch (error) {
      results.push({
        userId: user.user_id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
};

// ============================================================================
// API ハンドラ
// ============================================================================

/** 週次サマリー生成の Cron ジョブ。 */
export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const weekStart = getLastWeekMonday();

  const { users, error: usersError } = await fetchEligibleUsers(
    supabase,
    weekStart,
  );

  if (usersError) {
    return NextResponse.json({ message: usersError }, { status: 500 });
  }

  if (!users) {
    return NextResponse.json({
      message: "No users with logs for this week",
      weekStart,
    });
  }

  const agent = mastra.getAgent("weeklySummaryAgent");
  const results = await generateSummariesForAllUsers(
    supabase,
    agent,
    users,
    weekStart,
  );

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;

  return NextResponse.json({
    message: "Weekly summary generation completed",
    weekStart,
    successCount,
    failureCount,
    results,
  });
}
