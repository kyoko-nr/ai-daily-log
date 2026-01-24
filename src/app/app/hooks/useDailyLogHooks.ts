"use client";

import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { getLocalDate } from "@/lib/date";
import type {
  DailyLogCreateRequest,
  FollowupGenerateResponse,
} from "@/lib/schemas/dailyLogSchemas";

const DEFAULT_ERROR_MESSAGE = "保存に失敗しました";
const DEFAULT_GENERATE_ERROR_MESSAGE = "質問生成に失敗しました";

const readErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { message?: string };

    return data.message ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeGeneratedQuestion = (question: string) => {
  const trimmed = question.trim();

  if (
    trimmed.length === 0 ||
    trimmed === "```json" ||
    trimmed === "```" ||
    trimmed === "[" ||
    trimmed === "]"
  ) {
    return null;
  }

  const cleaned = trimmed
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .replace(/,$/, "")
    .replace(/^"+|"+$/g, "")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
};

const normalizeGeneratedQuestions = (questions: string[]) =>
  questions
    .map(normalizeGeneratedQuestion)
    .filter((question): question is string => Boolean(question));

type FollowupDraft = {
  id: string;
  question: string;
  answer: string;
};

const createFollowupDraftId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
};

/** 日次ログ作成フォームの状態と操作を提供する。 */
export const useDailyLogHooks = () => {
  const [logDate, setLogDate] = useState(() => getLocalDate());
  const [logText, setLogText] = useState("");
  const [followups, setFollowups] = useState<FollowupDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isLogEmpty = useMemo(() => logText.trim().length === 0, [logText]);
  const isGenerateDisabled = isLogEmpty || isGenerating;
  const isSaveDisabled = isLogEmpty || isSaving;

  const handleLogDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLogDate(event.target.value);
    },
    [],
  );

  const handleLogTextChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setLogText(event.target.value);
    },
    [],
  );

  const handleFollowupAnswerChange = useCallback(
    (followupId: string) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      setFollowups((previousFollowups) =>
        previousFollowups.map((followup) =>
          followup.id === followupId
            ? { ...followup, answer: event.target.value }
            : followup,
        ),
      );
    },
    [],
  );

  const handleRemoveFollowup = useCallback((followupId: string) => {
    setFollowups((previousFollowups) =>
      previousFollowups.filter((followup) => followup.id !== followupId),
    );
  }, []);

  const handleGenerateQuestions = useCallback(async () => {
    if (isGenerating) {
      return;
    }

    if (isLogEmpty) {
      setErrorMessage(null);
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/followups/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logText: logText.trim() }),
      });

      if (!response.ok) {
        const message = await readErrorMessage(
          response,
          DEFAULT_GENERATE_ERROR_MESSAGE,
        );
        setErrorMessage(message);
        return;
      }

      const data = (await response.json()) as FollowupGenerateResponse;
      const normalizedQuestions = normalizeGeneratedQuestions(data.questions);
      setFollowups(
        normalizedQuestions.map((question) => ({
          id: createFollowupDraftId(),
          question,
          answer: "",
        })),
      );
    } catch {
      setErrorMessage(DEFAULT_GENERATE_ERROR_MESSAGE);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, isLogEmpty, logText]);

  const handleSaveLog = useCallback(async () => {
    if (isSaving) {
      return;
    }

    if (isLogEmpty) {
      setErrorMessage(null);
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const payload: DailyLogCreateRequest = {
        logDate,
        logText: logText.trim(),
        followups:
          followups.length > 0
            ? followups.map((followup) => ({
                question: followup.question.trim(),
                answer: followup.answer.trim(),
              }))
            : null,
      };
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await readErrorMessage(response, DEFAULT_ERROR_MESSAGE);
        setErrorMessage(message);
        return;
      }

      setSuccessMessage("保存しました");
      setLogText("");
      setFollowups([]);
      setLogDate(getLocalDate());
    } catch {
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsSaving(false);
    }
  }, [followups, isLogEmpty, isSaving, logDate, logText]);

  return {
    logDate,
    logText,
    followups,
    errorMessage,
    successMessage,
    isLogEmpty,
    isGenerateDisabled,
    isSaveDisabled,
    isGenerating,
    isSaving,
    handleLogDateChange,
    handleLogTextChange,
    handleFollowupAnswerChange,
    handleRemoveFollowup,
    handleGenerateQuestions,
    handleSaveLog,
  };
};
