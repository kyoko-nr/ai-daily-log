"use client";

import { atom } from "jotai";

const pendingCountAtom = atom(0);

/** 処理の進行状態を保持する atom。 */
export const isPendingAtom = atom((get) => get(pendingCountAtom) > 0);

/** 処理の進行状態を更新する action。 */
export const changeIsPendingAction = atom(
  null,
  (_get, set, nextState: boolean) => {
    set(pendingCountAtom, (current) => {
      const nextCount = nextState ? current + 1 : current - 1;
      return Math.max(0, nextCount);
    });
  },
);
