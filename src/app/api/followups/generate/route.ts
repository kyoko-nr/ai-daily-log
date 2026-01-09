import { NextResponse } from "next/server";
import { authenticate, parseRequest } from "@/lib/api/requestUtils";
import {
  followupGenerateRequestSchema,
  followupGenerateResponseSchema,
  followupQuestionListSchema,
} from "@/lib/schemas/dailyLogSchemas";
import { mastra } from "@/mastra";

const parseQuestionsFromText = (text: string) => {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = followupQuestionListSchema.safeParse(JSON.parse(trimmed));
    if (parsed.success) {
      return parsed.data;
    }
  } catch {
    // Ignore JSON parse errors and try line-based parsing.
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.replace(/^[\s*\d.)-]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  const parsed = followupQuestionListSchema.safeParse(lines);
  if (parsed.success) {
    return parsed.data;
  }

  return null;
};

/** フォローアップ質問生成リクエストを処理する。 */
export async function POST(request: Request) {
  const authResult = await authenticate();

  if (!authResult.ok) {
    return authResult.response;
  }

  const parsedRequest = await parseRequest(
    followupGenerateRequestSchema,
    request,
  );

  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  try {
    const agent = mastra.getAgent("followupQuestionAgent");
    const result = await agent.generate(
      `以下のログ本文を元にフォローアップ質問を作成してください。\n\nログ本文:\n${parsedRequest.data.logText}`,
    );
    const text = result.text;
    const questions = parseQuestionsFromText(text);

    if (!questions) {
      return NextResponse.json(
        { message: "Failed to generate questions" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      followupGenerateResponseSchema.parse({ questions }),
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
