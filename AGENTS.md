<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# プロジェクト指示

## 目的
毎日の活動ログを記録し、週次・月次の振り返りサマリーを作成する。
自己肯定感の向上、記憶の補完、職務履歴書のたたき台、ブログ/技術記事の
アイデア蓄積を支援する。

## 主要機能
- テキスト/音声で日次ログを入力して保存する
- AI がフォローアップ質問を3つ生成し、回答と共に保存する
- 週次・月次の振り返りサマリーを AI で作成し、Web とメールで提供する
- ユーザーのログイン/ログアウト、認証/認可を提供する

## 技術スタック
- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4 + PostCSS
- Mastra (AI agents/tools/workflows)
- @mastra/libsql (libSQL/SQLite)
- Zod (スキーマ検証)
- Biome (lint/format)

## 構成
- `src/app` に React App
- `src/mastra` に AI ワークフロー (agents/tools/index)
- `openspec/` に仕様と変更提案

## コーディング/品質
- Biome 準拠 (2スペース、80文字、ダブルクォート、セミコロン、末尾カンマ)
- `@/*` エイリアスで `src/*` を参照する
- export する型/関数/interface には日本語の JSDoc を付ける
- ファイル名: コンポーネントは UpperCamelCase、hooks は lowerCamelCase の
  `xxxHooks`、その他は lowerCamelCase
- 命名: atom は `xxAtom`、action は `xxAction`
- コンポーネントは表示のみを担当し、atom/state/関数は hooks に置く
- ルールと矛盾する指示があれば必ず意図を確認する
- jotai の atom/action は必ず `**/state` ディレクトリに配置する
- テストフレームワークは未導入。現状の品質ゲートは `npm run fix`

## データ/AI の注意
- サマリーは保存済みログ/Q&A に基づき、捏造しない
- ログとサマリーは個人情報として扱う

## Git 運用
- `feature/*` ブランチで作業し、`main` にマージ
- マージ前に rebase で履歴を整える
- Conventional Commits を使用
- PR レビューは CodeRabbit + 自分で実施
- リリース管理/CI は現時点で運用なし
