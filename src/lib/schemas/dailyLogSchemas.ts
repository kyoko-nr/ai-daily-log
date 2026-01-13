import { z } from "zod";

/** フォローアップ質問のリストを検証するスキーマ。 */
export const followupQuestionListSchema = z
  .array(z.string().trim().min(1))
  .min(3)
  .max(5);

/** フォローアップ質問生成のリクエストスキーマ。 */
export const followupGenerateRequestSchema = z.object({
  logText: z.string().trim().min(1),
});

/** フォローアップ質問生成のレスポンススキーマ。 */
export const followupGenerateResponseSchema = z.object({
  questions: followupQuestionListSchema,
});

/** 日次ログ保存のリクエストスキーマ。 */
export const dailyLogCreateRequestSchema = z.object({
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  logText: z.string().trim().min(1),
  questions: followupQuestionListSchema.optional().nullable(),
  answer: z.string().optional().nullable(),
});

/** 日次ログ一覧アイテムのスキーマ。 */
export const dailyLogListItemSchema = z.object({
  id: z.uuid(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  logText: z.string(),
});

/** 日次ログ一覧レスポンスのスキーマ。 */
export const dailyLogListResponseSchema = z.object({
  logs: z.array(dailyLogListItemSchema),
});

/** フォローアップ質問生成リクエストの型。 */
export type FollowupGenerateRequest = z.infer<
  typeof followupGenerateRequestSchema
>;

/** フォローアップ質問生成レスポンスの型。 */
export type FollowupGenerateResponse = z.infer<
  typeof followupGenerateResponseSchema
>;

/** 日次ログ保存リクエストの型。 */
export type DailyLogCreateRequest = z.infer<typeof dailyLogCreateRequestSchema>;

/** 日次ログ一覧アイテムの型。 */
export type DailyLogListItem = z.infer<typeof dailyLogListItemSchema>;

/** 日次ログ一覧レスポンスの型。 */
export type DailyLogListResponse = z.infer<typeof dailyLogListResponseSchema>;
