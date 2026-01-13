# Design: /logs 月次一覧

## URL と状態管理
- 一覧ページ: `/logs`
- 選択中の月: atom（例: `selectedLogMonthAtom`、形式は `YYYY-MM`）
  - 初期値: 現在の月
  - 前月/次月ボタン: atom を更新し、その月のログを再取得する

## データ取得
- 一覧はクライアント側で取得する（atom の変更に追従するため）。
- API は選択中の年月を受け取り、対象期間のログを返す。
  - 例: `GET /api/logs?yearMonth=YYYY-MM`
- `daily_logs.log_date` は `date` 型のため、月の境界は日付文字列で扱う。
  - `startDate` = `YYYY-MM-01`（inclusive）
  - `endDate` = 次月 `YYYY-MM-01`（exclusive）
- ソート:
  - `log_date` 降順（同日があり得る場合は `created_at` も降順を補助キー）

## 認証
- `/app` と同様にサーバーサイドで `supabase.auth.getUser()` を確認し、
  未認証は `/login` へリダイレクトする。

## 詳細ページ（TODO）
- `/logs/[logId]` を用意し、現時点では「TODO」と `logId` のみ表示する。
  - 一覧のリンクが 404 にならないことを優先する。
