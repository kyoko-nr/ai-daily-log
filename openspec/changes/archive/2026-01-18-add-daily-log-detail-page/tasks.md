## 1. 実装
- [x] 1.1 `openspec/changes/add-daily-log-detail-page/specs/daily-log-detail/spec.md` を追加
- [x] 1.2 `openspec/changes/add-daily-log-detail-page/specs/daily-log-listing/spec.md` を追加（詳細 TODO の解消）
- [x] 1.3 詳細ページ用の取得処理（`daily_logs` + `daily_log_followups`）を追加する
- [x] 1.4 `src/app/logs/[logId]/page.tsx` を実装し、入力ではなく表示としてレンダリングする
- [x] 1.5 ページ右上に「削除」「修正」ボタンを配置（挙動は TODO として未実装）

## 2. 検証
- [x] 2.1 `openspec validate add-daily-log-detail-page --strict`
- [x] 2.2 `npm run fix`
- [ ] 2.3 手動確認（未認証リダイレクト、存在しない `logId` の挙動、フォローアップ有/無表示）
