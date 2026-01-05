"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";

type AuthNotice = {
  type: "error" | "info";
  message: string;
};

const authNoticeAtom = atom<AuthNotice | null>(null);

const changeAuthNoticeAction = atom(
  null,
  (_get, set, nextNotice: AuthNotice | null) => {
    set(authNoticeAtom, nextNotice);
  },
);

/** 認証通知の状態と更新関数を提供する。 */
export const useNoticeHooks = () => {
  const notice = useAtomValue(authNoticeAtom);
  const setNotice = useSetAtom(changeAuthNoticeAction);

  return { notice, setNotice };
};
