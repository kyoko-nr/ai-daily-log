"use client";

import TextAreaWithLabel from "@/app/app/components/TextAreaWithLabel";
import TextInputWithLabel from "@/app/app/components/TextInputWithLabel";
import { useDailyLogHooks } from "@/app/app/hooks/useDailyLogHooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const LOG_PLACEHOLDER =
  "今日やったこと、達成したこと、挑戦したこと、幸せだったこと、" +
  "手助けしたことなどを書いてみよう";

/** 日次ログ作成フォームを表示する。 */
export default function DailyLogForm() {
  const {
    logDate,
    logText,
    answerText,
    errorMessage,
    successMessage,
    isLogEmpty,
    isGenerateDisabled,
    isSaveDisabled,
    isGenerating,
    isSaving,
    handleLogDateChange,
    handleLogTextChange,
    handleAnswerChange,
    handleGenerateQuestions,
    handleSaveLog,
  } = useDailyLogHooks();
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Daily Log
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            今日の記録を残す
          </h2>
          <p className="text-sm text-zinc-500">
            まずはログを書き、必要なら質問を生成して回答を追加できます。
          </p>
        </div>
        <Button onClick={handleSaveLog} disabled={isSaveDisabled}>
          {isSaving ? "保存中..." : "保存する"}
        </Button>
      </div>

      <div className="grid gap-6">
        <TextInputWithLabel
          id="daily-log-date"
          label="日付"
          type="date"
          value={logDate}
          onChange={handleLogDateChange}
        />

        <TextAreaWithLabel
          id="daily-log"
          label="ログ本文"
          value={logText}
          placeholder={LOG_PLACEHOLDER}
          minHeightClassName="min-h-[160px]"
          errorMessage={isLogEmpty ? "ログを入力してください" : null}
          onChange={handleLogTextChange}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateQuestions}
            disabled={isGenerateDisabled}
          >
            {isGenerating ? "質問を生成中..." : "質問を生成"}
          </Button>
          <p className="text-xs text-zinc-500">
            質問は回答欄に改行区切りでセットされます。
          </p>
        </div>

        <TextAreaWithLabel
          id="daily-answer"
          label="回答"
          value={answerText}
          placeholder="質問が生成されるとここに表示されます"
          onChange={handleAnswerChange}
        />
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </section>
  );
}
