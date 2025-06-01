import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const querySchema = z.object({
  query: z.string().min(1, "查询内容不能为空"),
  filters: z
    .object({
      status: z.string().optional(),
      type: z.string().optional(),
      dateRange: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const body = await req.json()
    const { query, filters } = querySchema.parse(body)

    // 构建查询条件
    const whereClause: any = {
      userId: session.user.id,
    }

    // 添加文本搜索
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { type: { contains: query, mode: "insensitive" } },
      ]
    }

    // 添加状态过滤
    if (filters?.status) {
      whereClause.status = filters.status
    }

    // 添加类型过滤
    if (filters?.type) {
      whereClause.type = { contains: filters.type, mode: "insensitive" }
    }

    // 添加日期范围过滤
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      whereClause.createdAt = {}
      if (filters.dateRange.start) {
        whereClause.createdAt.gte = new Date(filters.dateRange.start)
      }
      if (filters.dateRange.end) {
        whereClause.createdAt.lte = new Date(filters.dateRange.end)
      }
    }

    // 执行查询
    const contracts = await prisma.contract.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    })

    // 获取统计信息
    const stats = await prisma.contract.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: { status: true },
    })

    return NextResponse.json({
      contracts,
      stats: stats.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status
          return acc
        },
        {} as Record<string, number>,
      ),
      total: contracts.length,
    })
  } catch (error) {
    console.error("Contract query error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "查询失败，请稍后重试" }, { status: 500 })
  }
}
