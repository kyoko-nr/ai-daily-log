# Tasks: 週次サマリー機能

## 1. データベース

- [x] 1.1 `user_settings` テーブルのマイグレーション作成（`summary_enabled` フラグ: 週次/月次共通）
- [x] 1.2 `user_settings` の RLS ポリシー設定
- [x] 1.3 `weekly_summaries` テーブルのマイグレーション作成
- [x] 1.4 `weekly_summaries` の RLS ポリシー設定
- [x] 1.5 週次ログ取得用の PL/pgSQL 関数作成（`get_weekly_logs_with_followups`）

## 2. Mastra エージェント

- [x] 2.1 `weekly-summary-agent.ts` を作成
- [x] 2.2 サマリー生成用のプロンプト設計・実装
- [x] 2.3 `src/mastra/index.ts` にエージェント登録
- [ ] 2.4 `mastra dev` で動作確認

## 3. Cron API 実装

- [x] 3.1 `POST /api/cron/weekly-summary` - Cron トリガー API
- [x] 3.2 `summary_enabled` フラグを参照して対象ユーザーをフィルタ

## 4. Vercel Cron 設定

- [x] 4.1 `vercel.json` に Cron 設定追加
- [x] 4.2 Cron エンドポイントの認証（`CRON_SECRET`）

## 5. 検証

- [ ] 5.1 ローカル環境での動作確認
- [x] 5.2 `npm run fix` で lint/型チェック通過
- [ ] 5.3 Vercel Preview でデプロイ確認
