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

    // 获取已完成合同
    const contracts = await prisma.contract.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        updatedAt: true,
        signatures: {
          select: {
            id: true,
            signedAt: true,
          },
        },
        metadata: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    // 处理数据，添加签名数量和完成时间
    const contractsWithDetails = contracts.map((contract) => {
      const lastSignature = contract.signatures.sort(
        (a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime(),
      )[0]

      return {
        id: contract.id,
        title: contract.title,
        type: contract.type,
        status: contract.status,
        completedAt: lastSignature?.signedAt || contract.updatedAt,
        signaturesCount: contract.signatures.length,
        totalValue: contract.metadata?.totalValue || null,
      }
    })

    // 获取总数
    const total = await prisma.contract.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    })

    return NextResponse.json({
      contracts: contractsWithDetails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取已完成合同失败:", error)
    return NextResponse.json({ error: "获取已完成合同失败" }, { status: 500 })
  }
}
