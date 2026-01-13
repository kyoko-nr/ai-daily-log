## Context
- 現状のログ入力は `/app`、ルート `/` はテンプレートのランディング。
- フォローアップ UI は「回答テキストエリア 1 つ」に質問を改行区切りで入れる方式。
- DB は `daily_logs` と `daily_log_followups`（`log_id` が primary key）で 1:1。
  `daily_log_followups.question` は質問をカンマ区切りで連結した文字列、`answer` は単一文字列。

## Goals / Non-Goals
- Goals:
  - ログ入力ページを `/` に移し、認証済みユーザーは直ちに入力できる。
  - 質問ごとに回答入力ができ、未回答でも質問レコードが保存される。
  - 1 ログに複数フォローアップが保存できる DB 形状にする。
- Non-Goals:
  - 過去ログ詳細画面でのフォローアップ閲覧/編集（今回の依頼範囲外）。
  - 既存データの「意味のある」回答分割（旧 `answer` を質問単位に正確に割れない）。

## Decisions
- Decision: `/` をログ入力ページとして扱い、未認証は `/login` にリダイレクトする。
- Decision: `/app` は廃止し、ルーティング上 404 とする。
- Decision: フォローアップの UI は「質問 N 個 → 入力 N 個」の繰り返しにする。
  質問行には削除ボタン（Xアイコン）を置き、行（label + input）ごと除去できる。
- Decision: 1 ログに対して複数行のフォローアップを保存できるように、
  `daily_log_followups` を「1 質問 + 1 回答 = 1 行」に変更する。
- Decision: 回答が空でも保存する（DB では `''` として保存する）。

## Data Model (Proposed)
- `daily_logs`: 変更なし
- `daily_log_followups`（変更）
  - `id uuid primary key default gen_random_uuid()`
  - `log_id uuid not null references public.daily_logs(id) on delete cascade`
  - `question text not null`
  - `answer text`（空の回答を保存できること）
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`（必要なら）

## API Shape (Proposed)
- `POST /api/logs` は `followups: { question: string; answer: string }[] | null`
  を受け取り、`followups` の要素ごとに DB 行を作成する。
  （現状の `questions: string[]` + `answer: string | null` は廃止/更新）

## Migration Plan
- 新しい Supabase migration を追加し、`daily_log_followups` を 1:N に移行する。
  - 既存の `daily_log_followups` が 1:1 かつ `question` がカンマ連結のため、
    過去データの `answer` を質問単位に正しく分割できない。
  - 移行方針: 既存 `question` を `string_to_array(..., ',')` で分解し、
    各質問に対して同一の `answer` を複製して行を作る（意味は曖昧になりうる）。
  - 移行後は `answer` の `NULL` を許容せず、空は `''` として扱う。

## Risks / Trade-offs
- スキーマ変更により、既存の RPC（`create_daily_log_with_followups`）とリクエストスキーマが変更になる。
- 旧データの回答は質問単位に正確に移行できないため、移行方針を明確にし、期待値を揃える必要がある。
