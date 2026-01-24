import { z } from "zod";

/**
 * フォローアップのスキーマ
 */
const FollowupSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/**
 * 日次ログとフォローアップクエスチョンのスキーマ
 */
export const LogWithFollowupsSchema = z.object({
  log_id: z.string(),
  log_date: z.string(),
  log_text: z.string(),
  followups: z.array(FollowupSchema),
});

/**
 * サマリ作成対象ユーザーのスキーマ
 */
export const UserForSummarySchema = z.object({
  user_id: z.string(),
  log_count: z.number(),
});

/**
 * サマリ作成結果のスキーマ
 */
export const SummaryResultSchema = z.object({
  userId: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
});

/**
 * フォローアップ
 */
export type Followup = z.infer<typeof FollowupSchema>;

/**
 * 日次ログとフォローアップクエスチョン
 */
export type LogWithFollowups = z.infer<typeof LogWithFollowupsSchema>;

/**
 * サマリ作成対象のユーザー
 */
export type UserForSummary = z.infer<typeof UserForSummarySchema>;

/**
 * サマリの作成結果
 */
export type SummaryResult = z.infer<typeof SummaryResultSchema>;
