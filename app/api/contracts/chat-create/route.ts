import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { AIContractService } from "@/lib/ai-service"
import { z } from "zod"

const createSchema = z.object({
  type: z.string().min(1, "合同类型不能为空"),
  requirements: z.string().min(1, "合同要求不能为空"),
  title: z.string().optional(),
  autoSave: z.boolean().optional().default(true),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const body = await req.json()
    const { type, requirements, title, autoSave } = createSchema.parse(body)

    // 使用 AI 生成合同内容
    const aiResult = await AIContractService.generateContract(type, requirements)

    if (!aiResult.success) {
      return NextResponse.json({ error: aiResult.error }, { status: 500 })
    }

    let contract = null

    // 如果启用自动保存，将合同保存到数据库
    if (autoSave) {
      contract = await prisma.contract.create({
        data: {
          title: title || `${type} - ${new Date().toLocaleDateString()}`,
          content: aiResult.contract!,
          type,
          status: "DRAFT",
          userId: session.user.id,
          metadata: {
            requirements,
            generatedBy: "AI",
            generatedAt: new Date().toISOString(),
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract?.id,
        title: contract?.title || title,
        content: aiResult.contract,
        type,
        status: contract?.status || "DRAFT",
        saved: autoSave,
      },
    })
  } catch (error) {
    console.error("Contract creation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "创建合同失败，请稍后重试" }, { status: 500 })
  }
}
