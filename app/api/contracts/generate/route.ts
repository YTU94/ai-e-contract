import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { AIContractService } from "@/lib/ai-service"
import { z } from "zod"

const generateSchema = z.object({
  type: z.string().min(1, "合同类型不能为空"),
  requirements: z.string().min(1, "合同要求不能为空"),
  stream: z.boolean().optional().default(false),
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
    const { type, requirements, stream } = generateSchema.parse(body)

    if (stream) {
      // 流式生成
      const result = await AIContractService.streamContractGeneration(type, requirements)
      return result.toDataStreamResponse()
    } else {
      // 一次性生成
      const result = await AIContractService.generateContract(type, requirements)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        contract: result.contract,
      })
    }
  } catch (error) {
    console.error("Contract generation API error:", error)

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
        error: "服务器内部错误",
      },
      { status: 500 },
    )
  }
}
