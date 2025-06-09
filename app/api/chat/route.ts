import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/database"

const chatSchema = z.object({
  message: z.string().min(1, "消息不能为空"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
})

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    // 验证请求数据
    const body = await req.json()
    const { message, history } = chatSchema.parse(body)

    // 检查 API 密钥是否配置
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI 服务未配置" }, { status: 500 })
    }

    // 获取用户的合同数据用于上下文
    const userContracts = await db.findContractsByUserId(session.user.id, { take: 10 })

    // 构建系统提示
    const systemPrompt = `你是 ContractAI 的智能助手，专门帮助用户管理电子合同。你的能力包括：

1. **合同查询** - 帮助用户查找和查看合同信息
2. **合同创建** - 协助用户创建各类电子合同
3. **合同分析** - 分析合同条款、识别风险点
4. **合同签署** - 指导用户完成电子签名流程
5. **合同管理** - 提供合同状态跟踪和管理建议

用户信息：
- 姓名：${session.user.name}
- 邮箱：${session.user.email}
- 公司：${session.user.company || "未设置"}

用户当前的合同列表：
${userContracts
  .map(
    (contract) =>
      `- ${contract.title} (${contract.type}) - 状态：${contract.status} - 更新时间：${contract.updatedAt.toLocaleDateString()}`,
  )
  .join("\n")}

请用中文回复，保持专业、友好的语调。如果用户询问具体的合同操作，请提供详细的步骤指导。`

    // 构建对话历史
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.slice(-8), // 保留最近8条对话历史
      { role: "user" as const, content: message },
    ]

    // 调用 OpenAI API
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // 分析响应类型和提取元数据
    const responseAnalysis = analyzeResponse(text, message)

    return NextResponse.json({
      response: text,
      type: responseAnalysis.type,
      metadata: responseAnalysis.metadata,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    // 处理 OpenAI API 错误
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "AI 服务配置错误" }, { status: 500 })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "AI 服务配额已用完" }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "AI 服务暂时不可用，请稍后重试" }, { status: 500 })
  }
}

// 分析响应内容，确定类型和提取元数据
function analyzeResponse(response: string, userMessage: string) {
  const lowerResponse = response.toLowerCase()
  const lowerMessage = userMessage.toLowerCase()

  // 检测合同相关操作
  if (lowerMessage.includes("查询") || lowerMessage.includes("查看") || lowerMessage.includes("搜索")) {
    if (lowerMessage.includes("合同")) {
      return {
        type: "contract_query",
        metadata: { action: "search" },
      }
    }
  }

  if (lowerMessage.includes("创建") || lowerMessage.includes("生成") || lowerMessage.includes("新建")) {
    if (lowerMessage.includes("合同")) {
      return {
        type: "contract_creation",
        metadata: { action: "create" },
      }
    }
  }

  if (lowerMessage.includes("签署") || lowerMessage.includes("签名") || lowerMessage.includes("盖章")) {
    return {
      type: "contract_signature",
      metadata: { action: "sign" },
    }
  }

  if (lowerMessage.includes("分析") || lowerMessage.includes("风险") || lowerMessage.includes("条款")) {
    return {
      type: "contract_analysis",
      metadata: { action: "analyze" },
    }
  }

  return {
    type: "text",
    metadata: null,
  }
}
