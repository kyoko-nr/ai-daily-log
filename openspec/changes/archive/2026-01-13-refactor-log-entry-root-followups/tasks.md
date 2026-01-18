## 1. Implementation
- [x] 1.1 ルート `/` をログ入力ページとして実装し、未認証は `/login` にリダイレクトする
- [x] 1.2 `/app` を廃止（404）として扱う
- [x] 1.3 ログイン成功後の遷移先を `/` に統一する（Server/Client 両方）
- [x] 1.4 フォローアップ UI を「質問 1 つにつき入力 1 つ」に変更する
- [x] 1.5 ❌（Xアイコン）で質問行（label + input）を削除できるようにする（保存対象からも除外）
- [x] 1.6 フォローアップの保存形式を `followups[]`（質問+回答の配列）に変更し、
  回答が空でも送信/保存できるようにする
- [x] 1.7 Supabase migration で `daily_log_followups` を 1:N に更新し、
  RLS/インデックス/RPC を新仕様に合わせて更新する
- [x] 1.8 `openspec validate refactor-log-entry-root-followups --strict` を実行して修正する
- [x] 1.9 `npm run fix`（Biome + tsc）を実行する

## 2. Validation Notes
- ルート `/` にアクセスした際の認証リダイレクトを確認する（未認証→`/login`）。
- 質問が N 件のときに入力が N 個表示され、削除が保存結果に反映されることを確認する。
- 空の回答でもフォローアップ行が作成されることを確認する。
