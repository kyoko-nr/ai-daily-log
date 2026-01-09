## ADDED Requirements
### Requirement: フォローアップ質問の生成
システムはログ本文を入力として、週次/月次サマリーの精度を高めるためのフォローアップ質問を日本語で 3〜5 件生成することを SHALL とする。
質問生成は Mastra を使用することを SHALL とする。

#### Scenario: 質問生成
- **WHEN** ログ本文が送信される
- **THEN** 3〜5 件の日本語質問を生成して返す

### Requirement: 質問の返却形式
システムは生成結果を質問配列として返し、UI が `ul/li` で表示できる順序を維持することを SHALL とする。

#### Scenario: 生成結果の返却
- **WHEN** 質問生成が成功する
- **THEN** `questions: string[]` を応答する
