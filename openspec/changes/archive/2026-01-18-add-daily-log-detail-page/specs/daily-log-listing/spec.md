## MODIFIED Requirements
### Requirement: ログ行リンク
システムは一覧内の各ログをリンクとして表示することを SHALL とする。
リンク押下時に詳細ページ（`/logs/[logId]`）へ遷移できることを SHALL とする。
詳細ページの要件は `daily-log-detail` capability が定義する。

#### Scenario: 詳細ページへの遷移
- **WHEN** ユーザーが一覧のログを押下する
- **THEN** 詳細ページへ遷移する

