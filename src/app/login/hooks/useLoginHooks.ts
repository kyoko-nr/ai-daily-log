"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

import { useNoticeHooks } from "./useNoticeHooks";
import { usePendingHooks } from "./usePendingHooks";

type LoginSectionProps = {
  email: string;
  password: string;
  isPending: boolean;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

/** ログインセクション向けの表示データと操作を返す。 */
export const useLoginHooks = (): LoginSectionProps => {
  const router = useRouter();
  const { setNotice } = useNoticeHooks();
  const { isPending, setIsPending } = usePendingHooks();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(event.target.value);
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(event.target.value);
  };

  const loginAction = async () => {
    if (isPending) {
      return;
    }

    const email = loginEmail.trim();
    const password = loginPassword.trim();

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setNotice({ type: "error", message: error.message });
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return {
    email: loginEmail,
    password: loginPassword,
    isPending,
    onEmailChange,
    onPasswordChange,
    onSubmit: loginAction,
  };
};
