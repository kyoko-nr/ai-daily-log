import { NextResponse } from "next/server";

import { authenticate, parseRequest } from "@/lib/api/requestUtils";
import { dailyLogCreateRequestSchema } from "@/lib/schemas/dailyLogSchemas";

const normalizeFollowups = (
  followups?: { question: string; answer: string }[] | null,
) => {
  if (!followups) {
    return null;
  }

  const normalized = followups
    .map((followup) => ({
      question: followup.question.trim(),
      answer: followup.answer.trim(),
    }))
    .filter((followup) => followup.question.length > 0);

  return normalized.length > 0 ? normalized : null;
};

/** 日次ログ保存リクエストを処理する。 */
export async function POST(request: Request) {
  const authResult = await authenticate();

  if (!authResult.ok) {
    return authResult.response;
  }

  const parsedRequest = await parseRequest(
    dailyLogCreateRequestSchema,
    request,
  );

  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  const { logDate, logText, followups } = parsedRequest.data;
  const { supabase } = authResult;
  const normalizedFollowups = normalizeFollowups(followups);
  const { data: logId, error: logError } = await supabase.rpc(
    "create_daily_log_with_followups",
    {
      p_log_date: logDate,
      p_log_text: logText,
      p_followups: normalizedFollowups,
    },
  );

  if (logError || !logId) {
    return NextResponse.json(
      { message: "Failed to save log" },
      { status: 500 },
    );
  }

  return NextResponse.json({ logId });
}
