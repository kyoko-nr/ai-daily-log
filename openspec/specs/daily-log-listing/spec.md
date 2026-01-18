# daily-log-listing Specification

## Purpose
認証済みユーザーが過去の日次ログを月単位で取得・一覧表示し、前月/次月の移動と詳細ページへの導線を提供する。
## Requirements
### Requirement: 過去ログ一覧ページ
システムは認証済みユーザー向けに `/logs` で日次ログ一覧ページを提供することを SHALL とする。
一覧は現在の月をデフォルトとして表示することを SHALL とする。

#### Scenario: 初期表示（当月）
- **WHEN** 認証済みユーザーが `/logs` を開く
- **THEN** 当月のログが日付降順で一覧表示される

#### Scenario: 未認証アクセス
- **WHEN** 未認証ユーザーが `/logs` を開く
- **THEN** `/login` へリダイレクトされる

### Requirement: 月移動と取得
システムは選択中の年月に対応するログを取得して一覧表示することを SHALL とする。
システムは前月/次月へ移動するボタンを提供することを SHALL とする。
システムは選択中の年月を URL パラメータ `yearMonth` で管理することを SHALL とする。

#### Scenario: 前月へ移動
- **WHEN** ユーザーが前月ボタンを押下する
- **THEN** URL の `yearMonth` が前月になり、その月のログが一覧表示される

#### Scenario: 次月へ移動
- **WHEN** ユーザーが次月ボタンを押下する
- **THEN** URL の `yearMonth` が次月になり、その月のログが一覧表示される

### Requirement: ログ行リンク
システムは一覧内の各ログをリンクとして表示することを SHALL とする。
リンク押下時に詳細ページ（`/logs/[logId]`）へ遷移できることを SHALL とする。
詳細ページの要件は `daily-log-detail` capability が定義する。

#### Scenario: 詳細ページへの遷移
- **WHEN** ユーザーが一覧のログを押下する
- **THEN** 詳細ページへ遷移する

