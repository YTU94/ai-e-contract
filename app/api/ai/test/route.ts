import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const testSchema = z.object({
  prompt: z.string().min(1, "测试提示不能为空"),
})

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份（可选，用于测试可以暂时注释掉）
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    // }

    // 验证请求数据
    const body = await req.json()
    const { prompt } = testSchema.parse(body)

    // 检查 API 密钥是否配置
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API 密钥未配置" }, { status: 500 })
    }

    // 调用 OpenAI API
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      maxTokens: 150,
    })

    return NextResponse.json({
      success: true,
      result: text,
      model: "gpt-4o",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI test error:", error)

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
        return NextResponse.json({ error: "OpenAI API 密钥无效或已过期" }, { status: 401 })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "OpenAI API 配额已用完" }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "AI 服务暂时不可用，请稍后重试" }, { status: 500 })
  }
}
