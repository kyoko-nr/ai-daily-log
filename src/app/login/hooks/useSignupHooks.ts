"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

import { useNoticeHooks } from "./useNoticeHooks";
import { usePendingHooks } from "./usePendingHooks";

type SignupSectionProps = {
  email: string;
  password: string;
  isPending: boolean;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

/** サインアップセクション向けの表示データと操作を返す。 */
export const useSignupHooks = (): SignupSectionProps => {
  const router = useRouter();
  const { setNotice } = useNoticeHooks();
  const { isPending, setIsPending } = usePendingHooks();
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSignupEmail(event.target.value);
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSignupPassword(event.target.value);
  };

  const signupAction = async () => {
    if (isPending) {
      return;
    }

    const email = signupEmail.trim();
    const password = signupPassword.trim();

    if (!email || !password) {
      setNotice({
        type: "error",
        message: "Email and password are required",
      });
      return;
    }

    setNotice(null);
    setIsPending(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setNotice({ type: "error", message: error.message });
        return;
      }

      if (data.session) {
        router.push("/app");
        router.refresh();
        return;
      }

      setNotice({
        type: "info",
        message: "Check your email to continue",
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    email: signupEmail,
    password: signupPassword,
    isPending,
    onEmailChange,
    onPasswordChange,
    onSubmit: signupAction,
  };
};
