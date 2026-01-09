import { atom } from "jotai";

/** 認証処理の進行状態を保持する atom。 */
export const isPendingAtom = atom(false);

/** 認証処理の進行状態を更新する action。 */
export const changeIsPendingAction = atom(
  null,
  (_get, set, nextState: boolean) => {
    set(isPendingAtom, nextState);
  },
);
