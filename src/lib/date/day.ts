/**
 * 日に関連する日付ユーティリティ関数。
 */

/**
 * 現在のローカル日付を取得する（ブラウザ向け）。
 *
 * ユーザーのタイムゾーンに基づいた「今日」の日付を返す。
 * 日次ログ入力フォームのデフォルト日付など、
 * ユーザーが認識する「今日」を表示する場面で使用する。
 *
 * @returns 現在のローカル日付（YYYY-MM-DD形式）
 * @example
 * // 日本時間 2026-01-24 08:00 に実行した場合
 * getLocalDate() // => "2026-01-24"
 */
export const getLocalDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};
