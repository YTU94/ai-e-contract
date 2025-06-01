import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

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

    // 构建查询条件
    const whereClause: any = {
      userId: session.user.id,
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      whereClause.status = status
    }

    if (type) {
      whereClause.type = { contains: type, mode: "insensitive" }
    }

    // 获取总数
    const total = await prisma.contract.count({ where: whereClause })

    // 获取合同列表
    const contracts = await prisma.contract.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

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
