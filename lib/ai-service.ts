// AI service configuration for contract analysis and generation
import { deepseek } from "@ai-sdk/deepseek"
import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"
import { remoteAPIClient, shouldUseRemoteAPI, type APIResponse } from "./remote-api-config"

// AI 服务配置
interface AIConfig {
  provider: "deepseek" | "openai"
  model: string
  client: any
}

// 获取 AI 配置
function getAIConfig(): AIConfig {
  // 优先使用 DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      provider: "deepseek",
      model: "deepseek-chat",
      client: deepseek('deepseek-chat'),
    }
  }

  // 回退到 OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: "gpt-4o",
      client: openai('gpt-4o'),
    }
  }

  throw new Error("No AI API key configured. Please set DEEPSEEK_API_KEY or OPENAI_API_KEY")
}

export class AIContractService {
  static async analyzeContract(contractContent: string) {
    // 检查是否使用远程API
    if (shouldUseRemoteAPI()) {
      return this.analyzeContractRemote(contractContent)
    }

    try {
      const config = getAIConfig()

      const { text } = await generateText({
        model: config.client(config.model),
        prompt: `作为专业的法律AI助手，请分析以下合同内容，并提供详细的分析报告：

合同内容：
${contractContent}

请按以下格式提供分析：

## 📋 合同基本信息
- 合同类型：
- 合同主题：
- 涉及方数量：

## 🔍 关键条款分析
1. **核心条款**：
2. **权利义务**：
3. **付款条款**：
4. **时间安排**：

## ⚠️ 风险点识别
1. **高风险条款**：
2. **模糊表述**：
3. **缺失条款**：

## 💰 财务条款
- 合同金额：
- 付款方式：
- 违约金条款：

## 📅 重要日期
- 合同期限：
- 关键节点：

## 💡 建议和改进
1. **条款优化建议**：
2. **风险防范措施**：
3. **合规性建议**：

## 📊 合同评分
- 完整性：/10
- 清晰度：/10
- 风险控制：/10
- 总体评分：/10

请用中文回复，确保分析专业、准确、实用。`,
        maxTokens: 2000,
        temperature: 0.7,
      })

      return {
        success: true,
        analysis: text,
        provider: config.provider,
        model: config.model,
        source: "local",
      }
    } catch (error) {
      console.error("AI analysis error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "local",
      }
    }
  }

  // 远程API合同分析
  static async analyzeContractRemote(contractContent: string) {
    try {
      const response = await remoteAPIClient.post<{
        analysis: string
        provider: string
        model: string
      }>("/api/contracts/analyze", {
        contractContent,
        options: {
          maxTokens: 2000,
          temperature: 0.7,
        },
      })

      if (response.success && response.data) {
        return {
          success: true,
          analysis: response.data.analysis,
          provider: response.data.provider,
          model: response.data.model,
          source: "remote",
        }
      }

      return {
        success: false,
        error: response.error || "Remote API analysis failed",
        source: "remote",
      }
    } catch (error) {
      console.error("Remote AI analysis error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "remote",
      }
    }
  }

  static async generateContract(contractType: string, requirements: string) {
    // 检查是否使用远程API
    if (shouldUseRemoteAPI()) {
      return this.generateContractRemote(contractType, requirements)
    }

    try {
      const config = getAIConfig()

      const { text } = await generateText({
        model: config.client(config.model),
        prompt: `作为专业的法律AI助手，请根据以下要求生成一份完整的${contractType}：

需求描述：
${requirements}

请生成一份专业、完整的合同，包含以下结构：

# ${contractType}

## 合同编号
[合同编号：待填写]

## 甲方（委托方/买方）
- 公司名称：[甲方公司名称]
- 法定代表人：[法定代表人姓名]
- 地址：[详细地址]
- 联系电话：[联系电话]
- 邮箱：[邮箱地址]

## 乙方（服务方/卖方）
- 公司名称：[乙方公司名称]
- 法定代表人：[法定代表人姓名]
- 地址：[详细地址]
- 联系电话：[联系电话]
- 邮箱：[邮箱地址]

## 第一条 合同目的和依据
[合同签署的目的和法律依据]

## 第二条 服务内容/商品描述
[详细的服务内容或商品描述]

## 第三条 合同金额和付款方式
[具体金额和付款安排]

## 第四条 履行期限和地点
[时间安排和履行地点]

## 第五条 双方权利和义务
### 甲方权利和义务：
### 乙方权利和义务：

## 第六条 质量标准和验收
[质量要求和验收标准]

## 第七条 违约责任
[违约情形和责任承担]

## 第八条 知识产权
[知识产权归属和保护]

## 第九条 保密条款
[保密义务和范围]

## 第十条 争议解决
[争议解决方式]

## 第十一条 合同变更和解除
[变更和解除条件]

## 第十二条 其他约定
[其他特殊约定]

## 第十三条 合同生效
本合同自双方签字盖章之日起生效，有效期至[结束日期]。

## 签署
甲方（盖章）：________________    乙方（盖章）：________________
法定代表人：__________________    法定代表人：__________________
签署日期：____________________    签署日期：____________________

请确保合同内容专业、完整、符合法律规范，并根据具体需求进行个性化调整。`,
        maxTokens: 3000,
        temperature: 0.7,
      })

      return {
        success: true,
        contract: text,
        provider: config.provider,
        model: config.model,
        source: "local",
      }
    } catch (error) {
      console.error("Contract generation error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "local",
      }
    }
  }

  // 远程API合同生成
  static async generateContractRemote(contractType: string, requirements: string) {
    try {
      const response = await remoteAPIClient.post<{
        contract: string
        provider: string
        model: string
      }>("/api/contracts/generate", {
        contractType,
        requirements,
        options: {
          maxTokens: 3000,
          temperature: 0.7,
        },
      })

      if (response.success && response.data) {
        return {
          success: true,
          contract: response.data.contract,
          provider: response.data.provider,
          model: response.data.model,
          source: "remote",
        }
      }

      return {
        success: false,
        error: response.error || "Remote API generation failed",
        source: "remote",
      }
    } catch (error) {
      console.error("Remote contract generation error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "remote",
      }
    }
  }

  static async streamContractGeneration(contractType: string, requirements: string) {
    const config = getAIConfig()

    return streamText({
      model: config.client(config.model),
      prompt: `根据以下要求生成一份${contractType}合同模板：

要求：
${requirements}

请生成一份完整的合同模板，逐步输出内容。`,
      maxTokens: 3000,
      temperature: 0.7,
    })
  }

  static async testConnection(customPrompt?: string) {
    // 检查是否使用远程API
    if (shouldUseRemoteAPI()) {
      return this.testConnectionRemote(customPrompt)
    }

    try {
      const config = getAIConfig()
      const prompt = customPrompt || "请用一句话介绍人工智能在合同管理中的应用。"

      const { text } = await generateText({
        model: config.client(config.model),
        prompt,
        maxTokens: 150,
        temperature: 0.7,
      })

      return {
        success: true,
        result: text,
        provider: config.provider,
        model: config.model,
        source: "local",
      }
    } catch (error) {
      console.error("AI test error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "local",
      }
    }
  }

  // 远程API测试连接
  static async testConnectionRemote(customPrompt?: string) {
    try {
      const prompt = customPrompt || "请用一句话介绍人工智能在合同管理中的应用。"

      const response = await remoteAPIClient.post<{
        result: string
        provider: string
        model: string
      }>("/api/ai/test", {
        prompt,
        options: {
          maxTokens: 150,
          temperature: 0.7,
        },
      })

      if (response.success && response.data) {
        return {
          success: true,
          result: response.data.result,
          provider: response.data.provider,
          model: response.data.model,
          source: "remote",
        }
      }

      return {
        success: false,
        error: response.error || "Remote API test failed",
        source: "remote",
      }
    } catch (error) {
      console.error("Remote AI test error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
        source: "remote",
      }
    }
  }

  static async performanceTest() {
    try {
      const config = getAIConfig()
      const startTime = Date.now()

      const testPrompts = ["请简述合同的基本要素。", "什么是违约责任？", "如何确保合同的法律效力？"]

      const results = []

      for (const prompt of testPrompts) {
        const testStart = Date.now()

        const { text } = await generateText({
          model: config.client(config.model),
          prompt,
          maxTokens: 100,
          temperature: 0.7,
        })

        const testEnd = Date.now()

        results.push({
          prompt,
          response: text,
          responseTime: testEnd - testStart,
        })
      }

      const totalTime = Date.now() - startTime

      return {
        success: true,
        provider: config.provider,
        model: config.model,
        totalTime,
        averageTime: totalTime / testPrompts.length,
        results,
      }
    } catch (error) {
      console.error("Performance test error:", error)
      return {
        success: false,
        error: this.getErrorMessage(error),
      }
    }
  }

  static getAIInfo() {
    try {
      // 如果使用远程API
      if (shouldUseRemoteAPI()) {
        const remoteConfig = remoteAPIClient.getConfig()
        return {
          available: !!remoteConfig,
          provider: "remote",
          model: "remote-api",
          source: "remote",
          baseURL: remoteConfig?.baseURL || "Not configured",
          sdkVersion: "remote-api-client",
        }
      }

      // 使用本地AI配置
      const config = getAIConfig()
      return {
        available: true,
        provider: config.provider,
        model: config.model,
        source: "local",
        sdkVersion: config.provider === "deepseek" ? "@ai-sdk/deepseek" : "@ai-sdk/openai",
      }
    } catch (error) {
      return {
        available: false,
        provider: "none",
        model: "N/A",
        source: shouldUseRemoteAPI() ? "remote" : "local",
        error: this.getErrorMessage(error),
      }
    }
  }

  private static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "AI API 密钥无效或已过期"
      }
      if (error.message.includes("quota")) {
        return "AI API 配额已用完，请检查账户余额"
      }
      if (error.message.includes("rate limit")) {
        return "请求频率过高，请稍后重试"
      }
      if (error.message.includes("No AI API key")) {
        return "未配置 AI API 密钥，请设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY"
      }
      return error.message
    }
    return "AI 服务暂时不可用，请稍后重试"
  }
}
