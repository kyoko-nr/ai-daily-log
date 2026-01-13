"use client";

import { X } from "lucide-react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** フォローアップ質問の入力行を表すデータ。 */
export type FollowUpInputItem = {
  id: string;
  question: string;
  answer: string;
};

/** フォローアップ質問の入力 UI に渡すプロパティ。 */
export type FollowUpInputProps = {
  followups: FollowUpInputItem[];
  onRemoveFollowup: (followupId: string) => void;
  onAnswerChange: (
    followupId: string,
  ) => (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

/** フォローアップ質問（質問ごとの回答入力と削除）を表示する。 */
export default function FollowUpInput({
  followups,
  onRemoveFollowup,
  onAnswerChange,
}: FollowUpInputProps) {
  if (followups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {followups.map((followup) => {
          const inputId = `followup-answer-${followup.id}`;
          return (
            <div
              key={followup.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <Label
                  htmlFor={inputId}
                  className="text-sm font-medium leading-6 text-zinc-900"
                >
                  {followup.question}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemoveFollowup(followup.id)}
                  aria-label="質問を削除"
                  title="削除"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>

              <Textarea
                id={inputId}
                value={followup.answer}
                placeholder="回答を入力"
                onChange={onAnswerChange(followup.id)}
                className="mt-3 min-h-[110px]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
