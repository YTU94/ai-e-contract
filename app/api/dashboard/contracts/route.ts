import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { db } from "@/lib/database"

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
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    // 获取合同列表
    const contracts = await db.findContractsByUserId(session.user.id, {
      search,
      status,
      type,
      skip: (page - 1) * limit,
      take: limit,
    })

    // 获取总数
    const total = await db.countContracts(session.user.id)

    return NextResponse.json({
      contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取合同列表失败:", error)
    return NextResponse.json({ error: "获取合同列表失败" }, { status: 500 })
  }
}
