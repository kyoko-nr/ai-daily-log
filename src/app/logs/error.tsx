"use client";

import { useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type LogsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 過去ログ一覧ページのエラーを表示する。 */
export default function LogsError({ error, reset }: LogsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-3">
      <Alert variant="destructive">
        <AlertDescription>
          {error.message || "ログの取得に失敗しました。"}
        </AlertDescription>
      </Alert>
      <Button type="button" onClick={reset}>
        再試行
      </Button>
    </div>
  );
}
