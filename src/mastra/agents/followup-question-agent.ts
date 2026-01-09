import { Agent } from "@mastra/core/agent";

/** フォローアップ質問を生成するエージェント。 */
export const followupQuestionAgent = new Agent({
  name: "followup-question-agent",
  instructions: `
    週次・月次の振り返りサマリーの質を高めるためのフォローアップ質問を生成してください。

    要件:
    - 日本語で3〜5個の質問を出力すること。
    - 各質問は短く具体的で、1文で回答できる内容にすること。
    - 出力は文字列の JSON 配列のみとし、余計なテキストは含めないこと。
  `,
  model: "openai/gpt-4o-mini",
});
