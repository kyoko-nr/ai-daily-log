interface Followup {
  question: string;
  answer: string;
}

/**
 * 日次ログとフォローアップクエスチョン
 */
export interface LogWithFollowups {
  log_id: string;
  log_date: string;
  log_text: string;
  followups: Followup[];
}

/**
 * サマリ作成対象のユーザー
 */
export interface UserForSummary {
  user_id: string;
  log_count: number;
}

/**
 * サマリの作成結果
 */
export interface SummaryResult {
  userId: string;
  success: boolean;
  error?: string;
}
