## 1. 実装
- [x] 1.1 `openspec/changes/add-log-list-page/specs/daily-log-listing/spec.md` を更新（atom 管理へ変更）
- [x] 1.2 `/logs` のページを追加し、当月のログを降順で一覧表示する
- [x] 1.3 選択中の月を `**/state` 配下の atom で管理し、前月/次月ボタンで月移動できるようにする
- [x] 1.4 `GET /api/logs`（一覧取得）を追加し、選択中の月のログを取得できるようにする
- [x] 1.5 一覧の各ログを詳細ページリンクにし、`/logs/[logId]` の TODO ページを追加する

## 2. 検証
- [x] 2.1 `openspec validate add-log-list-page --strict`
- [x] 2.2 `npm run fix`
- [ ] 2.3 手動確認（未認証リダイレクト、月移動、空状態、リンク遷移）
