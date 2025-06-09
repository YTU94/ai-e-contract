import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const templates = await db.findActiveTemplates()

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

    const template = await db.createTemplate({
      name,
      description,
      content,
      category,
      isActive: true,
    })

    // 记录审计日志
    await db.createAuditLog({
      action: "CREATE_TEMPLATE",
      entityType: "ContractTemplate",
      entityId: template.id,
      userId: session.user.id,
      details: { name, category },
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error("Create template error:", error)
    return NextResponse.json({ error: "创建模板失败" }, { status: 500 })
  }
}
