# プロジェクト概要

## 目的
毎日の活動ログを記録し、週次・月次の振り返りサマリーを作成するアプリです。
やったことの可視化、記憶の補完、職務履歴書作成の起点、ブログ/技術記事の
アイデア蓄積を支援します。

## 技術スタック
- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4 + PostCSS
- Mastra (AI agents/tools/workflows)
- @mastra/libsql (libSQL/SQLite)
- Zod (スキーマ検証)
- Biome (lint/format)

## プロジェクト規約

### コードスタイル
- Biome 準拠: 2スペースインデント、80文字幅、ダブルクォート、セミコロン、
  末尾カンマ、import の整理。
- `@/*` パスエイリアスで `src/*` を参照する。

### アーキテクチャ
- `src/app` に App Router を配置。Server Components を基本とする。
- AI ワークフローは `src/mastra` に集約 (agents/tools/index)。
- Mastra のストレージは libSQL を使用。必要に応じて in-memory と
  file/remote を切り替える。

### テスト方針
- まだテストフレームワークは未導入。
- 現在の品質ゲートは `npm run __lint` (Biome + `tsc --noEmit`)。
- 将来的に要約、保存、認証周りのテストを追加予定 (TBD)。

### Git ワークフロー
- `feature/*` ブランチで作業し、`main` にマージする。
- マージ前に rebase して履歴を整える。
- Conventional Commits を使用する (例: `feat: ...`, `fix: ...`)。
- PR は CodeRabbit と自分でレビューする。
- リリース管理/CI は現時点で運用しない。

## ドメイン知識
- ユーザーは日次ログをテキストまたは音声で入力する。
- ログは勉強・仕事の内容を想定し、失敗、苦労、成功、工夫などを含む。
- 入力だけでは振り返りが不十分なため、AI がフォローアップ質問を3つ生成する。
- ログ、質問と回答を保存し、週次・月次サマリーを作成する。
- サマリーは自己肯定感の向上、振り返り、職務履歴書作成、ブログのネタ出しに使う。

## 重要な制約
- 週次・月次の出力は保存済みログ/Q&A に基づき、捏造しない。
- ログ/サマリーは個人情報として高い機密性を持つ。
- 週次・月次サマリーは Web UI とメールの両方で閲覧可能にする。

## 外部依存
- LLM プロバイダ (Mastra 経由、TBD)
- レポート配信用のメールサービス (TBD)
- 認証/認可の外部サービス (TBD)
- libSQL/SQLite via @mastra/libsql (開発時は in-memory)
