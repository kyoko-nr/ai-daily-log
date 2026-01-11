# Change: 既存UIをshadcn/uiに置き換え

## Why
現在のプロジェクトでは、UIコンポーネント（入力、ボタン、フォームなど）を独自に実装している。
これらをshadcn/uiのコンポーネントに置き換えることで、以下のメリットが得られる：
- 一貫性のあるデザインシステムの導入
- アクセシビリティの向上（ARIA属性、キーボード操作など）
- メンテナンス性の向上（共通コンポーネントの活用）
- 将来の機能拡張時の開発効率向上

## What Changes
- shadcn/uiの初期設定（`components.json`の作成、依存関係の追加）
- 既存のカスタムコンポーネントをshadcn/uiコンポーネントに置き換え：
  - `TextInputWithLabel` → shadcn/uiの`Input`と`Label`
  - `TextAreaWithLabel` → shadcn/uiの`Textarea`と`Label`
  - ボタンコンポーネント → shadcn/uiの`Button`
  - エラーメッセージと成功メッセージ → shadcn/uiの`Alert`
  - フォーム関連のスタイリングをshadcn/uiのデザインシステムに統一
- 既存の機能とスタイルを維持しつつ、shadcn/uiのコンポーネントを使用
- 影響範囲：
  - `src/app/app/components/DailyLogForm.tsx`
  - `src/app/app/components/TextInputWithLabel.tsx`
  - `src/app/app/components/TextAreaWithLabel.tsx`
  - `src/app/app/components/LogoutButton.tsx`
  - `src/app/login/components/LoginClient.tsx`
  - `src/app/login/components/LoginSection.tsx`
  - `src/app/login/components/SignupSection.tsx`
  - `src/app/login/components/ResetSection.tsx`

## Impact
- Affected specs: `daily-log-entry`（UIコンポーネントの見た目は変わるが、機能要件は維持）
- Affected code:
  - 上記のコンポーネントファイル
  - `src/app/globals.css`（shadcn/uiのCSS変数の追加）
  - `package.json`（shadcn/ui関連の依存関係追加）
  - `components.json`（新規作成）
  - `src/components/ui/`（新規ディレクトリ、shadcn/uiコンポーネント用）
