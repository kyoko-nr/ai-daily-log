## MODIFIED Requirements
### Requirement: /login でのログイン
システムは `/login` にメール/パスワードのログインフォームを提供することを SHALL とする。
UIコンポーネントはshadcn/uiのコンポーネント（`Input`, `Label`, `Button`）を使用することを SHALL とする。

#### Scenario: ログイン成功
- **WHEN** ユーザーが有効なメールアドレスとパスワードを送信する
- **THEN** セッションを作成し `/app` へリダイレクトする
- **AND** shadcn/uiのコンポーネントが使用されている

#### Scenario: ログイン失敗
- **WHEN** ユーザーが無効な認証情報を送信する
- **THEN** 認証エラーを表示し `/login` に留まる

### Requirement: /login でのサインアップ
システムは `/login` からメール/パスワードでアカウント作成を行えることを SHALL とする。
UIコンポーネントはshadcn/uiのコンポーネント（`Input`, `Label`, `Button`）を使用することを SHALL とする。

#### Scenario: サインアップ成功
- **WHEN** ユーザーが新しいメールアドレスとパスワードを送信する
- **THEN** アカウントを作成しセッションを開始して `/app` へリダイレクトする
- **AND** shadcn/uiのコンポーネントが使用されている

### Requirement: パスワードリセット要求
システムは `/login` からパスワードリセットメールを要求できることを SHALL とする。
UIコンポーネントはshadcn/uiのコンポーネント（`Input`, `Label`, `Button`）を使用することを SHALL とする。

#### Scenario: リセットメール送信
- **WHEN** ユーザーが登録済みメールアドレスでリセットを要求する
- **THEN** リセットメールを送信し確認メッセージを表示する
- **AND** shadcn/uiのコンポーネントが使用されている

### Requirement: ログアウト
システムはサインイン済みユーザーが `/app` からログアウトできることを SHALL とする。
UIコンポーネントはshadcn/uiのコンポーネント（`Button`）を使用することを SHALL とする。

#### Scenario: ログアウト成功
- **WHEN** サインイン済みユーザーがログアウトを実行する
- **THEN** セッションを破棄し `/login` へリダイレクトする
- **AND** shadcn/uiのコンポーネントが使用されている
