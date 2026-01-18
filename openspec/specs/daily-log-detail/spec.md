# daily-log-detail Specification

## Purpose
TBD - created by archiving change add-daily-log-detail-page. Update Purpose after archive.
## Requirements
### Requirement: 過去ログ詳細ページ
システムは認証済みユーザー向けに `GET /logs/[logId]` で日次ログの詳細ページを提供することを SHALL とする。
詳細ページは対象ログの `log_date` と `log_text` を表示することを SHALL とする。

#### Scenario: 詳細ページの表示
- **WHEN** 認証済みユーザーが `GET /logs/[logId]` を開く
- **THEN** 日付とログ本文が表示される

### Requirement: フォローアップ質問/回答の表示
システムは詳細ページで、対象ログに紐づくフォローアップ質問/回答を表示することを SHALL とする。
フォローアップは「1 質問 + 1 回答 = 1 行」の行集合として表示することを SHALL とする。
`answer` が空文字の場合は空表示とし、未回答を示す文言を表示しないことを SHALL とする。

#### Scenario: フォローアップあり
- **WHEN** 対象ログにフォローアップが 1 件以上ある
- **THEN** 質問/回答が件数分表示される

#### Scenario: フォローアップなし
- **WHEN** 対象ログにフォローアップが 0 件である
- **THEN** フォローアップの表示領域は表示されない

### Requirement: 表示は読み取り専用
システムは詳細ページの表示において、入力 UI（`Input`/`Textarea`）ではなくラベルとテキスト表示を用いることを SHALL とする。
UIコンポーネントは shadcn/ui のコンポーネント（`Label`, `Button`）を使用することを SHALL とする。

#### Scenario: 読み取り専用の表示
- **WHEN** ユーザーが詳細ページを閲覧する
- **THEN** 編集可能な入力欄は表示されない
- **AND** ラベルとテキスト表示で内容が閲覧できる

### Requirement: 削除/修正ボタンの配置
システムは詳細セクションの右上に「削除」「修正」ボタンを表示することを SHALL とする。
本 capability ではボタンの挙動は未定義（TODO）とする。

#### Scenario: ボタンの表示
- **WHEN** ユーザーが詳細ページを開く
- **THEN** 「削除」「修正」ボタンが表示される

### Requirement: 認証の強制
システムは未認証ユーザーが詳細ページへアクセスした場合、`/login` へリダイレクトすることを SHALL とする。

#### Scenario: 未認証アクセス
- **WHEN** 未認証ユーザーが `GET /logs/[logId]` を開く
- **THEN** `/login` へリダイレクトされる

### Requirement: 不正な logId のフォールバック
システムは対象のログが存在しない、または参照権限がない場合、`/logs` へフォールバックすることを SHALL とする。

#### Scenario: 対象ログが存在しない
- **WHEN** ユーザーが存在しない `logId` で `GET /logs/[logId]` を開く
- **THEN** `/logs` へフォールバックされる

