// AI service configuration for contract analysis and generation
import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"
import { envConfig } from "./env"

// Initialize OpenAI client only if API key is available
const aiModel = envConfig.OPENAI_API_KEY ? openai("gpt-4o") : null

export class AIContractService {
  static async analyzeContract(contractContent: string) {
    if (!aiModel) {
      throw new Error("AI service not configured. Please add OPENAI_API_KEY to environment variables.")
    }

    try {
      const { text } = await generateText({
        model: aiModel,
        prompt: `分析以下合同内容，识别关键条款、潜在风险点和重要信息：

合同内容：
${contractContent}

请提供：
1. 合同类型识别
2. 关键条款摘要
3. 潜在风险点
4. 重要日期和金额
5. 建议和注意事项

请用中文回复，格式清晰。`,
      })

      return {
        success: true,
        analysis: text,
      }
    } catch (error) {
      console.error("AI analysis error:", error)
      return {
        success: false,
        error: "AI分析失败，请稍后重试",
      }
    }
  }

  static async generateContract(contractType: string, requirements: string) {
    if (!aiModel) {
      throw new Error("AI service not configured. Please add OPENAI_API_KEY to environment variables.")
    }

    try {
      const { text } = await generateText({
        model: aiModel,
        prompt: `根据以下要求生成一份${contractType}合同模板：

要求：
${requirements}

请生成一份完整的合同模板，包括：
1. 合同标题
2. 甲乙双方信息
3. 合同条款
4. 权利义务
5. 违约责任
6. 争议解决
7. 其他必要条款

请确保合同内容专业、完整且符合法律规范。`,
      })

      return {
        success: true,
        contract: text,
      }
    } catch (error) {
      console.error("Contract generation error:", error)
      return {
        success: false,
        error: "合同生成失败，请稍后重试",
      }
    }
  }

  static async streamContractGeneration(contractType: string, requirements: string) {
    if (!aiModel) {
      throw new Error("AI service not configured. Please add OPENAI_API_KEY to environment variables.")
    }

    return streamText({
      model: aiModel,
      prompt: `根据以下要求生成一份${contractType}合同模板：

要求：
${requirements}

请生成一份完整的合同模板，逐步输出内容。`,
    })
  }
}
