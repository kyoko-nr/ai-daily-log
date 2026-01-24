/**
 * 週に関連する日付ユーティリティ関数。
 */

/**
 * 前週の月曜日の日付を取得する。
 *
 * @returns 前週の月曜日の日付（YYYY-MM-DD形式）
 * @example
 * // 2026-01-24（金曜日）に実行した場合
 * getLastWeekMonday() // => "2026-01-13"
 */
export const getLastWeekMonday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getUTCDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysToLastMonday = daysToMonday + 7;
  const lastMonday = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - daysToLastMonday,
    ),
  );

  return lastMonday.toISOString().split("T")[0];
};
