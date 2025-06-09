import { type NextRequest, NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"
import { z } from "zod"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const testSchema = z.object({
  prompt: z.string().optional(),
  testType: z.enum(["basic", "performance", "custom"]).optional().default("basic"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, testType } = testSchema.parse(body)

    switch (testType) {
      case "basic":
        const basicResult = await AIContractService.testConnection(prompt)
        return NextResponse.json({
          success: basicResult.success,
          result: basicResult.result,
          provider: basicResult.provider,
          model: basicResult.model,
          error: basicResult.error,
          timestamp: new Date().toISOString(),
        })

      case "performance":
        const perfResult = await AIContractService.performanceTest()
        return NextResponse.json({
          success: perfResult.success,
          provider: perfResult.provider,
          model: perfResult.model,
          totalTime: perfResult.totalTime,
          averageTime: perfResult.averageTime,
          results: perfResult.results,
          error: perfResult.error,
          timestamp: new Date().toISOString(),
        })

      case "custom":
        if (!prompt) {
          return NextResponse.json({ error: "自定义测试需要提供 prompt 参数" }, { status: 400 })
        }
        const customResult = await AIContractService.testConnection(prompt)
        return NextResponse.json({
          success: customResult.success,
          result: customResult.result,
          provider: customResult.provider,
          model: customResult.model,
          error: customResult.error,
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json({ error: "不支持的测试类型" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI test API error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "AI 服务测试失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const aiInfo = AIContractService.getAIInfo()

    return NextResponse.json({
      success: true,
      ...aiInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI info API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "获取 AI 信息失败",
      },
      { status: 500 },
    )
  }
}
