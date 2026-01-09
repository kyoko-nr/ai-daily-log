"use client";

import TextAreaWithLabel from "@/app/app/components/TextAreaWithLabel";
import TextInputWithLabel from "@/app/app/components/TextInputWithLabel";
import { useDailyLogHooks } from "@/app/app/hooks/useDailyLogHooks";

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
        <button
          className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={handleSaveLog}
          disabled={isSaveDisabled}
        >
          {isSaving ? "保存中..." : "保存する"}
        </button>
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
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleGenerateQuestions}
            disabled={isGenerateDisabled}
          >
            {isGenerating ? "質問を生成中..." : "質問を生成"}
          </button>
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

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      {successMessage && (
        <p className="text-sm text-emerald-600">{successMessage}</p>
      )}
    </section>
  );
}
