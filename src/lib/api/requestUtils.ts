import type { SupabaseClient, User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { ZodTypeAny, z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthResult =
  | {
      ok: true;
      supabase: SupabaseClient;
      user: User;
    }
  | {
      ok: false;
      response: NextResponse;
    };

type ParseResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      response: NextResponse;
    };

/** 認証済みユーザーと Supabase クライアントを取得する。 */
export const authenticate = async (): Promise<AuthResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    ok: true,
    supabase,
    user: data.user,
  };
};

/** リクエスト本文を JSON 解析し、スキーマで検証する。 */
export const parseRequest = async <Schema extends ZodTypeAny>(
  schema: Schema,
  request: Request,
): Promise<ParseResult<z.output<Schema>>> => {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ message: "Invalid JSON" }, { status: 400 }),
    };
  }

  const parsedRequest = schema.safeParse(json);

  if (!parsedRequest.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Invalid request" },
        { status: 400 },
      ),
    };
  }

  return { ok: true, data: parsedRequest.data };
};
