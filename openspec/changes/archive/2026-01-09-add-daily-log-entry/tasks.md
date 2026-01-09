## 1. Implementation
- [x] 1.1 Supabase に `daily_logs` テーブル（`user_id`, `log_date`, `log_text`,
  `created_at`, `updated_at`）と、`daily_log_followups` テーブル
  （`log_id`, `question`, `answer`, `created_at`）と RLS を追加する
  (`question` は質問をカンマ区切りで連結した 1 つの文字列)
- [x] 1.2 日次ログ保存・質問生成のリクエスト/レスポンス用 Zod スキーマを定義する
- [x] 1.3 Mastra のフォローアップ質問生成エージェントを追加し、
  3〜5 件の日本語質問を返せるようにする
- [x] 1.4 `POST /api/followups/generate` を実装し、認証確認・入力検証・質問生成を行う
- [x] 1.5 `POST /api/logs` を実装し、認証確認・入力検証・Supabase への保存を行う
- [x] 1.6 `/app` の UI を日次ログ作成フォームに更新し、
  日付入力、ログ入力、質問生成、回答入力への質問セット、保存を実装する
- [x] 1.7 質問生成ボタンの無効化とエラーメッセージ表示を実装する
- [x] 1.8 `npm run fix` でフォーマットと型チェックを実行する
