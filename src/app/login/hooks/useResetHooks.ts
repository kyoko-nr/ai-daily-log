"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

import { useNoticeHooks } from "./useNoticeHooks";
import { usePendingHooks } from "./usePendingHooks";

type ResetSectionProps = {
  email: string;
  isPending: boolean;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

/** リセットセクション向けの表示データと操作を返す。 */
export const useResetHooks = (): ResetSectionProps => {
  const { setNotice } = useNoticeHooks();
  const { isPending, setIsPending } = usePendingHooks();
  const [resetEmail, setResetEmail] = useState("");

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResetEmail(event.target.value);
  };

  const resetAction = async () => {
    if (isPending) {
      return;
    }

    const email = resetEmail.trim();

    if (!email) {
      setNotice({
        type: "error",
        message: "Email is required",
      });
      return;
    }

    setNotice(null);
    setIsPending(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setNotice({ type: "error", message: error.message });
        return;
      }

      setNotice({
        type: "info",
        message: "Password reset email sent",
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    email: resetEmail,
    isPending,
    onEmailChange,
    onSubmit: resetAction,
  };
};
