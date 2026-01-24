/**
 * 月に関連する日付ユーティリティ関数。
 */

/**
 * 現在の年月を取得する（UTC基準）。
 *
 * @returns 現在の年月（YYYY-MM形式）
 * @example
 * // 2026年1月に実行した場合
 * getCurrentYearMonth() // => "2026-01"
 */
export const getCurrentYearMonth = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");

  return `${year}-${month}`;
};

/**
 * 指定した年月を前後にシフトする。
 *
 * @param yearMonth - シフト元の年月（YYYY-MM形式）
 * @param delta - シフトする月数（正: 未来、負: 過去）
 * @returns シフト後の年月（YYYY-MM形式）
 * @example
 * shiftMonth("2026-01", 1)  // => "2026-02"
 * shiftMonth("2026-01", -1) // => "2025-12"
 */
export const shiftMonth = (yearMonth: string, delta: number): string => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const targetMonth = new Date(Date.UTC(year, month - 1, 1));

  targetMonth.setUTCMonth(targetMonth.getUTCMonth() + delta);

  const shiftedYear = targetMonth.getUTCFullYear();
  const shiftedMonth = `${targetMonth.getUTCMonth() + 1}`.padStart(2, "0");

  return `${shiftedYear}-${shiftedMonth}`;
};

/**
 * 年月から月の開始日と終了日（翌月1日）の範囲を取得する。
 *
 * @param yearMonth - 対象の年月（YYYY-MM形式）
 * @returns 月の開始日と終了日（YYYY-MM-DD形式）
 * @example
 * toMonthRange("2026-01")
 * // => { startDate: "2026-01-01", endDate: "2026-02-01" }
 */
export const toMonthRange = (
  yearMonth: string,
): { startDate: string; endDate: string } => {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};
