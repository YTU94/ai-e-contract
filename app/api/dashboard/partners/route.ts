import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { db } from "@/lib/database"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    // 获取查询参数
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // 获取合作伙伴统计
    const partners = await db.getPartnerStats(session.user.id)

    // 分页
    const total = partners.length
    const paginatedPartners = partners.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      partners: paginatedPartners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取合作伙伴失败:", error)
    return NextResponse.json({ error: "获取合作伙伴失败" }, { status: 500 })
  }
}
