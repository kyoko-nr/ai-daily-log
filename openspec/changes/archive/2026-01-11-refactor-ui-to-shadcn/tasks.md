## 1. shadcn/uiの初期設定
- [x] 1.1 `npx shadcn-ui@latest init`を実行して`components.json`を作成
- [x] 1.2 `src/app/globals.css`にshadcn/uiのCSS変数を追加
- [x] 1.3 必要な依存関係がインストールされていることを確認

## 2. 基本コンポーネントの追加
- [x] 2.1 `npx shadcn-ui@latest add button`でButtonコンポーネントを追加
- [x] 2.2 `npx shadcn-ui@latest add input`でInputコンポーネントを追加
- [x] 2.3 `npx shadcn-ui@latest add textarea`でTextareaコンポーネントを追加
- [x] 2.4 `npx shadcn-ui@latest add label`でLabelコンポーネントを追加
- [x] 2.5 `npx shadcn-ui@latest add alert`でAlertコンポーネントを追加

## 3. 既存コンポーネントの置き換え
- [x] 3.1 `TextInputWithLabel.tsx`をshadcn/uiの`Input`と`Label`を使用するように置き換え
- [x] 3.2 `TextAreaWithLabel.tsx`をshadcn/uiの`Textarea`と`Label`を使用するように置き換え
- [x] 3.3 `DailyLogForm.tsx`内のボタンをshadcn/uiの`Button`に置き換え
- [x] 3.4 `LogoutButton.tsx`をshadcn/uiの`Button`を使用するように置き換え
- [x] 3.5 `LoginSection.tsx`内の入力とボタンをshadcn/uiコンポーネントに置き換え
- [x] 3.6 `SignupSection.tsx`内の入力とボタンをshadcn/uiコンポーネントに置き換え
- [x] 3.7 `ResetSection.tsx`内の入力とボタンをshadcn/uiコンポーネントに置き換え

## 4. エラーメッセージと成功メッセージの置き換え
- [x] 4.1 `DailyLogForm.tsx`のエラーメッセージと成功メッセージをAlertコンポーネントに置き換え
- [x] 4.2 `TextAreaWithLabel.tsx`のエラーメッセージをAlertコンポーネントに置き換え（またはFormコンポーネントのFormMessageを使用）
- [x] 4.3 `LogoutButton.tsx`のエラーメッセージをAlertコンポーネントに置き換え
- [x] 4.4 `LoginClient.tsx`のnotice表示をAlertコンポーネントに置き換え

## 5. スタイリングの調整
- [x] 5.1 既存のデザイン（色、サイズ、スペーシング）をshadcn/uiのテーマに合わせて調整
- [x] 5.2 レスポンシブデザインが維持されていることを確認

## 6. 動作確認とテスト
- [ ] 6.1 ログイン/サインアップ/リセット機能が正常に動作することを確認
- [ ] 6.2 日次ログフォームの入力・保存機能が正常に動作することを確認
- [ ] 6.3 質問生成機能が正常に動作することを確認
- [ ] 6.4 エラーハンドリングがAlertコンポーネントで適切に表示されることを確認
- [ ] 6.5 成功メッセージがAlertコンポーネントで適切に表示されることを確認
- [ ] 6.6 アクセシビリティ（キーボード操作、スクリーンリーダー）を確認

## 7. コード品質チェック
- [x] 7.1 `npm run fix`を実行してlint/formatエラーがないことを確認
- [x] 7.2 TypeScriptの型エラーがないことを確認
- [x] 7.3 不要になったカスタムコンポーネントファイルを削除（`TextInputWithLabel.tsx`, `TextAreaWithLabel.tsx`は削除しない。shadcn/uiコンポーネントを使用するように変更する）
