# authenticate-user Specification

## Purpose
ユーザー認証機能を提供する。Supabase Authを使用してメール/パスワードによるログイン、サインアップ、ログアウト、パスワードリセットを実現する。
## Requirements
### Requirement: Supabase のメール/パスワード認証
システムは Supabase Auth を用いてメール/パスワードのログイン、サインアップ、ログアウト、パスワードリセット要求を提供することを SHALL とする。

#### Scenario: 認証プロバイダの利用
- **WHEN** 認証フローが実行される
- **THEN** Supabase Auth の API を使用して処理する

### Requirement: /login でのログイン
ログイン成功後のリダイレクト先を `/` に変更することを SHALL とする。

#### Scenario: ログイン成功
- **WHEN** ユーザーが有効なメールアドレスとパスワードを送信する
- **THEN** セッションを作成し `/` へリダイレクトする

### Requirement: /login でのサインアップ
サインアップ成功後のリダイレクト先を `/` に変更することを SHALL とする。

#### Scenario: サインアップ成功
- **WHEN** ユーザーが新しいメールアドレスとパスワードを送信する
- **THEN** アカウントを作成しセッションを開始して `/` へリダイレクトする

### Requirement: パスワードリセット要求
システムは `/login` からパスワードリセットメールを要求できることを SHALL とする。
UIコンポーネントはshadcn/uiのコンポーネント（`Input`, `Label`, `Button`）を使用することを SHALL とする。

#### Scenario: リセットメール送信
- **WHEN** ユーザーが登録済みメールアドレスでリセットを要求する
- **THEN** リセットメールを送信し確認メッセージを表示する
- **AND** shadcn/uiのコンポーネントが使用されている

### Requirement: サーバーサイド認証の強制
システムは `/` へのアクセスに対してサーバーサイドで認証を検証することを SHALL とする。

#### Scenario: 未認証アクセス
- **WHEN** 有効なセッションを持たないユーザーが `/` にアクセスする
- **THEN** `/login` へリダイレクトされる

#### Scenario: 認証済みアクセス
- **WHEN** 有効なセッションを持つユーザーが `/` にアクセスする
- **THEN** アプリケーションの内容（ログ入力フォーム）を表示する

### Requirement: ログアウト
システムはサインイン済みユーザーが `/` からログアウトできることを SHALL とする。

#### Scenario: ログアウト成功
- **WHEN** サインイン済みユーザーがログアウトを実行する
- **THEN** セッションを破棄し `/login` へリダイレクトする

### Requirement: middleware 非依存
システムは Next.js middleware に依存して認証を強制してはならないことを SHALL とし、認証チェックは server components またはサーバーサイドハンドラで実行することを SHALL とする。

#### Scenario: 認証チェックの実行場所
- **WHEN** 保護対象ルートの認証チェックを実行する
- **THEN** middleware ではなくサーバーサイドのコンポーネントまたはハンドラで実行する

