# OpenSpec 指示

OpenSpec を用いた仕様駆動開発のための、AI コーディングアシスタント向け指示。

## 一番重要

- ドキュメントは必ず日本語で作成すること

## TL;DR クイックチェックリスト

- 既存作業の検索: `openspec spec list --long`, `openspec list` (全文検索は `rg` のみ)
- スコープ判断: 新規機能か既存機能の変更か
- 一意な `change-id` を選ぶ: kebab-case、動詞始まり (`add-`, `update-`, `remove-`, `refactor-`)
- 雛形作成: `proposal.md`, `tasks.md`, `design.md` (必要時), 影響する capability の差分 spec
- 差分作成: `## ADDED|MODIFIED|REMOVED|RENAMED Requirements` を使い、各要件に `#### Scenario:` を最低1つ
- 検証: `openspec validate [change-id] --strict` を実行して修正
- 承認依頼: proposal が承認されるまで実装を開始しない

## 3段階ワークフロー

### Stage 1: 変更の作成
以下の場合は proposal を作成する:
- 機能/機能性の追加
- 破壊的変更 (API, スキーマ)
- アーキテクチャやパターンの変更
- パフォーマンス最適化 (挙動が変わるもの)
- セキュリティパターンの変更

トリガー例:
- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

ゆるいマッチの指針:
- `proposal`, `change`, `spec` のいずれかを含む
- `create`, `plan`, `make`, `start`, `help` のいずれかを含む

proposal をスキップするもの:
- 仕様の意図通りに戻すバグ修正
- タイポ、フォーマット、コメント
- 依存更新 (非破壊)
- 設定変更
- 既存挙動に対するテスト追加

**Workflow**
1. `openspec/project.md`, `openspec list`, `openspec list --specs` を確認し文脈を把握する。
2. 一意な動詞始まりの `change-id` を選び、`proposal.md`, `tasks.md`, 必要なら `design.md`、
   影響する capability の差分 spec を `openspec/changes/<id>/` に作成する。
3. `## ADDED|MODIFIED|REMOVED Requirements` を使って差分 spec を作成し、各要件に
   `#### Scenario:` を最低1つ記載する。
4. `openspec validate <id> --strict` を実行して問題を解消してから共有する。

### Stage 2: 変更の実装
TODO を順に追跡して完了する。
1. **proposal.md を読む** - 何を作るか理解する
2. **design.md を読む** (あれば) - 技術判断を確認する
3. **tasks.md を読む** - 実装チェックリストを把握する
4. **タスクを順に実装** - 記載順に完了させる
5. **完了確認** - `tasks.md` の全項目が完了していることを確認する
6. **チェック更新** - 全作業完了後に `- [x]` へ更新する
7. **承認ゲート** - proposal のレビュー/承認前に実装しない

### Stage 3: 変更のアーカイブ
デプロイ後に別PRで実施:
- `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/` へ移動
- 必要に応じて `specs/` を更新
- toolingのみの変更は `openspec archive <change-id> --skip-specs --yes`
- `openspec validate --strict` でアーカイブ後を検証

## タスク開始前

**コンテキストチェックリスト:**
- [ ] `specs/[capability]/spec.md` の関連仕様を読む
- [ ] `changes/` の未完了変更を確認する
- [ ] `openspec/project.md` で規約を確認する
- [ ] `openspec list` で進行中の変更を把握する
- [ ] `openspec list --specs` で既存 capability を確認する

**仕様作成前:**
- 既存 capability があるか必ず確認
- 重複を避け、既存 spec の更新を優先
- `openspec show [spec]` で現状を確認
- 依頼が曖昧なら、1〜2問だけ確認してから雛形作成

### 検索ガイダンス
- spec 一覧: `openspec spec list --long` (スクリプト用途は `--json`)
- change 一覧: `openspec list` (`openspec change list --json` は非推奨だが利用可)
- 詳細表示:
  - Spec: `openspec show <spec-id> --type spec` (`--json` でフィルタ)
  - Change: `openspec show <change-id> --json --deltas-only`
- 全文検索 (ripgrep): `rg -n "Requirement:|Scenario:" openspec/specs`

## クイックスタート

### CLI コマンド

```bash
# Essential commands
openspec list                  # List active changes
openspec list --specs          # List specifications
openspec show [item]           # Display change or spec
openspec validate [item]       # Validate changes or specs
openspec archive <change-id> [--yes|-y]   # Archive after deployment (add --yes for non-interactive runs)

# Project management
openspec init [path]           # Initialize OpenSpec
openspec update [path]         # Update instruction files

# Interactive mode
openspec show                  # Prompts for selection
openspec validate              # Bulk validation mode

# Debugging
openspec show [change] --json --deltas-only
openspec validate [change] --strict
```

### コマンドフラグ

- `--json` - 機械可読
- `--type change|spec` - 種別の明示
- `--strict` - 厳格検証
- `--no-interactive` - 対話プロンプトを無効化
- `--skip-specs` - spec 更新なしでアーカイブ
- `--yes`/`-y` - 確認プロンプトをスキップ

## ディレクトリ構成

```
openspec/
├── project.md              # プロジェクト規約
├── specs/                  # 現在の真実 - すでに実装済み
│   └── [capability]/       # 単一目的の capability
│       ├── spec.md         # 要件とシナリオ
│       └── design.md       # 技術パターン
├── changes/                # 提案 - 変更すべきこと
│   ├── [change-name]/
│   │   ├── proposal.md     # なぜ/なにを/影響
│   │   ├── tasks.md        # 実装チェックリスト
│   │   ├── design.md       # 技術判断 (任意; criteria 参照)
│   │   └── specs/          # 差分
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 完了済み変更
```

## 変更提案の作成

### 判断ツリー

```
New request?
├─ Bug fix restoring spec behavior? → Fix directly
├─ Typo/format/comment? → Fix directly
├─ New feature/capability? → Create proposal
├─ Breaking change? → Create proposal
├─ Architecture change? → Create proposal
└─ Unclear? → Create proposal (safer)
```

### Proposal 構成

1. **ディレクトリ作成:** `changes/[change-id]/` (kebab-case, 動詞始まり, 一意)

2. **proposal.md を作成:**
```markdown
# Change: [Brief description of change]

## Why
[1-2 sentences on problem/opportunity]

## What Changes
- [Bullet list of changes]
- [Mark breaking changes with **BREAKING**]

## Impact
- Affected specs: [list capabilities]
- Affected code: [key files/systems]
```

3. **差分 spec の作成:** `specs/[capability]/spec.md`
```markdown
## ADDED Requirements
### Requirement: New Feature
The system SHALL provide...

#### Scenario: Success case
- **WHEN** user performs action
- **THEN** expected result
```
複数 capability に影響する場合は、`changes/[change-id]/specs/<capability>/spec.md` を
capability ごとに作成する。

4. **tasks.md を作成:**
```markdown
## 1. Implementation
- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component
- [ ] 1.4 Write tests
```

5. **design.md を作成する条件:**
以下のいずれかがある場合に作成。なければ省略。
- 横断的変更 (複数サービス/モジュール) や新しいアーキテクチャパターン
- 新規の外部依存や大きなデータモデル変更
- セキュリティ/性能/移行の複雑性
- 技術判断が必要で、事前に決めた方がよい場合

最小の `design.md` 雛形:
```markdown
## Context
[Background, constraints, stakeholders]

## Goals / Non-Goals
- Goals: [...]
- Non-Goals: [...]

## Decisions
- Decision: [What and why]
- Alternatives considered: [Options + rationale]

## Risks / Trade-offs
- [Risk] → Mitigation

## Migration Plan
[Steps, rollback]

## Open Questions
- [...]
```

## Spec ファイル形式

### 重要: シナリオのフォーマット

**正しい例** (`####` を使用):
```markdown
#### Scenario: User login success
- **WHEN** valid credentials provided
- **THEN** return JWT token
```

**誤り** (使わない):
```markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
```

各要件に最低1つのシナリオが必須。

### 要件の書き方
- 規範的要件は SHALL/MUST を使う (should/may は意図がある場合のみ)

### 差分オペレーション

- `## ADDED Requirements` - 新規 capability
- `## MODIFIED Requirements` - 既存挙動の変更
- `## REMOVED Requirements` - 機能の削除
- `## RENAMED Requirements` - 名前変更

ヘッダは `trim(header)` で比較される (空白無視)。

#### ADDED と MODIFIED の使い分け
- ADDED: 新しい capability または独立した要件の追加。
- MODIFIED: 既存要件の挙動/範囲/受け入れ基準の変更。必ず全文を貼り替える。

注意: MODIFIED に新規要件だけを追加すると、既存詳細が消える。
既存要件を変えないなら ADDED で追加する。

MODIFIED の正しい手順:
1) `openspec/specs/<capability>/spec.md` から既存要件を探す。
2) `### Requirement: ...` からシナリオまでを丸ごとコピー。
3) `## MODIFIED Requirements` に貼り、内容を編集。
4) ヘッダは完全一致 (空白無視) させ、シナリオを必ず残す。

RENAMED の例:
```markdown
## RENAMED Requirements
- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## トラブルシューティング

### よくあるエラー

**"Change must have at least one delta"**
- `changes/[name]/specs/` に .md があるか確認
- `## ADDED Requirements` などのプレフィックスがあるか確認

**"Requirement must have at least one scenario"**
- `#### Scenario:` 形式になっているか確認
- 箇条書きや太字での Scenario ヘッダは不可

**シナリオが認識されない**
- 正確に `#### Scenario: Name` を使う
- デバッグ: `openspec show [change] --json --deltas-only`

### 検証のヒント

```bash
# Always use strict mode for comprehensive checks
openspec validate [change] --strict

# Debug delta parsing
openspec show [change] --json | jq '.deltas'

# Check specific requirement
openspec show [spec] --json -r 1
```

## ハッピーパス

```bash
# 1) Explore current state
openspec spec list --long
openspec list
# Optional full-text search:
# rg -n "Requirement:|Scenario:" openspec/specs
# rg -n "^#|Requirement:" openspec/changes

# 2) Choose change id and scaffold
CHANGE=add-two-factor-auth
mkdir -p openspec/changes/$CHANGE/{specs/auth}
printf "## Why\n...\n\n## What Changes\n- ...\n\n## Impact\n- ...\n" > openspec/changes/$CHANGE/proposal.md
printf "## 1. Implementation\n- [ ] 1.1 ...\n" > openspec/changes/$CHANGE/tasks.md

# 3) Add deltas (example)
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.

#### Scenario: OTP required
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOF

# 4) Validate
openspec validate $CHANGE --strict
```

## 複数 capability の例

```
openspec/changes/add-2fa-notify/
├── proposal.md
├── tasks.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: Two-Factor Authentication
    └── notifications/
        └── spec.md   # ADDED: OTP email notification
```

auth/spec.md
```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
...
```

notifications/spec.md
```markdown
## ADDED Requirements
### Requirement: OTP Email Notification
...
```

## ベストプラクティス

### シンプルさ優先
- 新規コードは <100 行を目安
- 単一ファイルの実装から始める
- 明確な理由がない限りフレームワークを増やさない
- 安定した素直なパターンを優先

### 複雑化のトリガー
以下がある時だけ複雑化:
- 現状が遅いという性能データ
- 具体的なスケール要件 (>1000 users, >100MB)
- 複数の実証済みユースケースがある

### 明確な参照
- コード位置は `file.ts:42` 形式
- spec の参照は `specs/auth/spec.md`
- 関連変更や PR をリンク

### Capability 命名
- 動詞-名詞: `user-auth`, `payment-capture`
- 目的を単一に
- 10分で理解できる粒度
- 説明に AND が入るなら分割

### Change ID 命名
- kebab-case、短く説明的: `add-two-factor-auth`
- `add-`, `update-`, `remove-`, `refactor-` を優先
- 重複する場合は `-2`, `-3` で調整

## ツール選定ガイド

| Task | Tool | Why |
|------|------|-----|
| Find files by pattern | Glob | Fast pattern matching |
| Search code content | Grep | Optimized regex search |
| Read specific files | Read | Direct file access |
| Explore unknown scope | Task | Multi-step investigation |

## エラー復旧

### 変更の競合
1. `openspec list` で進行中の変更を確認
2. 影響する spec の重複を確認
3. 変更オーナーと調整
4. proposal の統合を検討

### 検証失敗
1. `--strict` で実行
2. JSON 出力で詳細確認
3. spec の形式を確認
4. シナリオ形式を確認

### コンテキスト不足
1. `project.md` を読む
2. 関連 spec を確認
3. 最近の archive を確認
4. 不明点は質問

## クイックリファレンス

### Stage の意味
- `changes/` - 提案中 (未実装)
- `specs/` - 実装済みの真実
- `archive/` - 完了済み変更

### ファイルの用途
- `proposal.md` - なぜ/なにを
- `tasks.md` - 実装手順
- `design.md` - 技術判断
- `spec.md` - 要件と挙動

### CLI 要点
```bash
openspec list              # What's in progress?
openspec show [item]       # View details
openspec validate --strict # Is it correct?
openspec archive <change-id> [--yes|-y]  # Mark complete (add --yes for automation)
```

忘れないで: Specs are truth. Changes are proposals. Keep them in sync.
