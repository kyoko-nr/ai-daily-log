"use client";

import { atom } from "jotai";

// TODO: #9 - 競合状態を防ぐためのリファクタリングを検討
// 現在の実装は共有カウンターを使用しており、複数の操作が急速に
// トリガーされた場合に不正確になる可能性がある。解決策はIssueを参照。
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
