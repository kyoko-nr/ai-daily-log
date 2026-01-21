# Design: 週次サマリー機能

## Context

日次ログとフォローアップ Q&A は既に実装済み。これらを週単位で集約し、
AI がサマリーを生成する機能を追加する。Vercel Cron で自動生成し、
DB に保存する。

### 制約

- project.md: 「週次・月次の出力は保存済みログ/Q&A に基づき、捏造しない」
- Mastra エージェントは `mastra dev` で動作確認可能にする

## Goals / Non-Goals

### Goals

- 週単位（月曜〜日曜）でログを集約し、AI サマリーを生成
- Vercel Cron による自動生成（毎週月曜 AM 9:00 JST）
- Mastra エージェントとして実装し、`mastra dev` で確認可能
- ユーザーごとに自動生成の有効/無効をフラグで制御

### Non-Goals

- サマリーの一覧・詳細表示 UI（別提案）
- サマリー取得 API（別提案）
- 月次サマリー（別提案）
- メール配信（別提案）
- サマリーの手動編集
- サマリーの再生成機能

## Decisions

### 1. 週の定義

- **決定**: ISO 8601 週（月曜始まり〜日曜終わり）を採用
- **理由**: 国際標準であり、PostgreSQL の `date_trunc('week', date)` と整合する

### 2. サマリー生成タイミング

- **決定**: Vercel Cron で毎週月曜 9:00 JST に自動生成
- **理由**: 前週のログが確定した後に生成するため
- **Cron 式**: `0 0 * * 1`（UTC 0:00 = JST 9:00）

### 3. AI モデル選択

- **決定**: GPT-4o-mini（既存の followup-question-agent と同じ）
- **理由**: コスト効率が良く、サマリー生成には十分な性能
- **代替案**: gpt-4o（より高品質だがコスト増）→ 必要に応じて後で切替可能

### 4. サマリー内容の構成

- **決定**: 以下のセクションを含むマークダウン形式
  - 今週のハイライト（2-3 項目）
  - 学び・気づき
  - 課題・改善点
  - 来週に向けて
- **理由**: 振り返りとアクション志向のバランス

### 5. データがない週の扱い

- **決定**: ログが 0 件の週はサマリーを生成しない
- **理由**: 空のサマリーは価値がなく、ストレージの無駄

### 6. API 設計

- **決定**:
  - `POST /api/cron/weekly-summary` - Cron トリガー（内部用）
- **理由**: 今回のスコープは自動生成のみ。取得 API は UI 実装時に別提案で追加

### 7. ユーザーごとの自動生成フラグ

- **決定**: `user_settings` テーブルに `summary_enabled` フラグを追加
- **理由**: 将来的に課金ユーザーのみに機能を限定するための動線を確保
- **デフォルト値**: `true`（現時点では全ユーザーに対して有効）
- **Cron 動作**: フラグが `true` のユーザーのみサマリーを生成
- **備考**: 週次・月次サマリーを一貫して制御するフラグ

## Risks / Trade-offs

| リスク | 軽減策 |
|--------|--------|
| AI 生成がハルシネーションを起こす | プロンプトで「提供されたログのみを参照」と明示 |
| Cron 実行失敗 | エラーログを記録、次週に再試行可能な設計 |
| ログが大量の場合のトークン制限 | 週 7 日分なので通常は問題なし。必要なら要約を段階的に |

## Data Model

```sql
-- ユーザー設定テーブル
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 週次サマリーテーブル
CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,  -- その週の月曜日
  summary_text TEXT NOT NULL,
  log_count INTEGER NOT NULL,  -- 集約したログ数
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, week_start)
);

-- RLS
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries"
  ON weekly_summaries FOR SELECT
  USING (auth.uid() = user_id);

-- 通常ユーザーからの INSERT は禁止（service_role は RLS をバイパス）
CREATE POLICY "Deny insert for regular users"
  ON weekly_summaries FOR INSERT
  WITH CHECK (false);
```
