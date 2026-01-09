# Change: 日次ログ作成ページとフォローアップ質問生成の追加

## Why
日次ログの入力と保存がまだなく、週次/月次サマリーの材料が不足しているため。

## What Changes
- `/app` に日次ログ作成フォームを追加する
- フォローアップ質問は回答入力欄に直接セットし、専用の表示領域は設けない
- Mastra でフォローアップ質問を生成する API を追加する
- Supabase に日次ログとフォローアップ質問を別テーブルで保存する API とテーブルを追加する

## Impact
- Affected specs: daily-log-entry, followup-question-generation
- Affected code: `src/app/app`, `src/app/api`, `src/mastra`, `supabase`
