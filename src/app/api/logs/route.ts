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
  const { supabase, user } = authResult;
  const { data: logData, error: logError } = await supabase
    .from("daily_logs")
    .insert({
      user_id: user.id,
      log_date: logDate,
      log_text: logText,
    })
    .select("id")
    .single();

  if (logError || !logData) {
    return NextResponse.json(
      { message: "Failed to save log" },
      { status: 500 },
    );
  }

  const normalizedQuestions = normalizeQuestions(questions);

  if (normalizedQuestions) {
    const normalizedAnswer = answer?.trim();
    const { error: followupError } = await supabase
      .from("daily_log_followups")
      .insert({
        log_id: logData.id,
        question: normalizedQuestions.join(","),
        answer:
          normalizedAnswer && normalizedAnswer.length > 0
            ? normalizedAnswer
            : null,
      });

    if (followupError) {
      return NextResponse.json(
        { message: "Failed to save followup" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ logId: logData.id });
}
