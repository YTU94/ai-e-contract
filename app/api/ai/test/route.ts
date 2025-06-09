import { type NextRequest, NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "缺少 prompt 参数" }, { status: 400 })
    }

    const result = await AIContractService.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        result: result.result,
        provider: result.provider,
        model: result.model,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("AI test API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "AI 服务测试失败",
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
