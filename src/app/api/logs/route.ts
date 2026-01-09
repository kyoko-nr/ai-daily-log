import { NextResponse } from "next/server";

import { authenticate, parseRequest } from "@/lib/api/requestUtils";
import { dailyLogCreateRequestSchema } from "@/lib/schemas/dailyLogSchemas";

const normalizeQuestions = (questions?: string[] | null) => {
  if (!questions) {
    return null;
  }

  const normalized = questions
    .map((question) => question.trim())
    .filter(Boolean);

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

  const { logDate, logText, questions, answer } = parsedRequest.data;
  const { supabase } = authResult;
  const normalizedQuestions = normalizeQuestions(questions);

  const normalizedAnswer = answer?.trim();
  const { data: logId, error: logError } = await supabase.rpc(
    "create_daily_log_with_followups",
    {
      p_log_date: logDate,
      p_log_text: logText,
      p_questions: normalizedQuestions,
      p_answer:
        normalizedAnswer && normalizedAnswer.length > 0
          ? normalizedAnswer
          : null,
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
