## Context
- `/app` は現在プレースホルダーのみで、日次ログ入力がない。
- Supabase Auth を利用しており、ログは個人情報として扱う必要がある。

## Goals / Non-Goals
- Goals: 日次ログ入力、フォローアップ質問生成、Supabase への保存を提供する。
- Non-Goals: ログの一覧/編集/削除、週次/月次サマリー生成、メール配信。

## Decisions
- Decision: `daily_logs` テーブルに日次ログを保存し、フォローアップは
  `daily_log_followups` テーブルに `log_id`, `question`, `answer` を保持する。
  `question` はフォローアップ質問をカンマ区切りで連結した 1 つの文字列とし、
  `answer` は 1 つの回答を保持する。`answer` は未入力時に `null` を許可する。
- Decision: フォローアップ質問生成は Mastra の専用エージェントで実装し、
  日本語の質問を 3〜5 件返す。
- Decision: 生成した質問は UI の回答入力欄に直接セットし、専用の質問表示領域は設けない。
- Decision: 保存時は回答入力欄の内容と生成済み質問を独立して保存し、
  生成済み質問はカンマ区切りの文字列として `daily_log_followups` に 1 件保存する。
- Decision: Next.js Route Handler を用いて
  `POST /api/followups/generate` と `POST /api/logs` を提供する。
- Decision: `log_date` はクライアントのローカル日付を `YYYY-MM-DD` で受け取り、
  Supabase には `date` 型で保存する。

## Risks / Trade-offs
- JSONB による followups 保存は検索性が下がるが、MVP の要件を満たすため採用する。
- LLM の生成品質に揺らぎがあるため、出力は配列の件数と空値を検証する。

## Migration Plan
- Supabase に `daily_logs` テーブルと RLS ポリシーを追加する。
- `user_id = auth.uid()` を満たす挿入/参照のみ許可する。

## Open Questions
- なし
