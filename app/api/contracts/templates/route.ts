import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/database-setup"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const templates = await prisma.contractTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Get templates error:", error)
    return NextResponse.json({ error: "获取模板失败" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const { name, description, content, category } = await req.json()

    const template = await prisma.contractTemplate.create({
      data: {
        name,
        description,
        content,
        category,
      },
    })

    // 记录审计日志
    await createAuditLog("CREATE_TEMPLATE", "ContractTemplate", template.id, session.user.id, { name, category }, req)

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error("Create template error:", error)
    return NextResponse.json({ error: "创建模板失败" }, { status: 500 })
  }
}
