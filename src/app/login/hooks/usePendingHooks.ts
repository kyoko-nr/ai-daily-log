"use client";

import { useAtomValue, useSetAtom } from "jotai";

import { changeIsPendingAction, isPendingAtom } from "../state/isPendingAtom";

/** 認証アクションの進行状態と更新関数を提供する。 */
export const usePendingHooks = () => {
  const isPending = useAtomValue(isPendingAtom);
  const setIsPending = useSetAtom(changeIsPendingAction);

  return { isPending, setIsPending };
};
