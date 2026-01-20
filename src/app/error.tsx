"use client";

import { useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * アプリ全体のエラーを表示する。
 * TODO: #13 - 引数のerrorの妥当性。画面に表示しても問題ないエラー文言のみ表示させるようにすること。
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    // TODO: 本番環境ではエラー追跡サービス（Sentry等）に送信する
  }, [error]);

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <main className="mx-auto w-full max-w-3xl space-y-3">
        <Alert variant="destructive">
          <AlertDescription>
            {error.message || "予期しないエラーが発生しました。"}
          </AlertDescription>
        </Alert>
        <Button type="button" onClick={reset}>
          再試行
        </Button>
      </main>
    </div>
  );
}
