# Change: 週次サマリー機能の追加

## Why

ユーザーは日々の活動ログを記録しているが、個別のログだけでは振り返りが難しい。
週単位でログを集約し、AI が自動で振り返りサマリーを生成することで、自己肯定感の向上、
学びの定着、職務履歴書作成やブログのネタ出しを支援する。

## What Changes

- **新規 capability**: `weekly-summary` を追加
- **DB**: `user_settings` テーブル、`weekly_summaries` テーブルを追加（RLS 付き）
- **AI Agent**: 週次サマリー生成エージェントを Mastra に追加
- **Cron**: Vercel Cron で毎週自動生成（フラグが有効なユーザーのみ）

## Impact

- 影響する既存 specs: なし（新規 capability）
- 新規 specs: `weekly-summary`
- 影響するコード:
  - `src/mastra/agents/` - 新規エージェント追加
  - `src/mastra/index.ts` - エージェント登録
  - `src/app/api/cron/` - Cron トリガー API
  - `supabase/migrations/` - 新規マイグレーション

## Out of Scope

- サマリー一覧・詳細の UI（別提案で対応）
- サマリー取得 API（UI と一緒に別提案で対応）
- 月次サマリー（別提案で対応）
- メール配信（別提案で対応）
- サマリーの編集機能
