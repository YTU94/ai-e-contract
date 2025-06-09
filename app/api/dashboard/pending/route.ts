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

    // 获取待签署合同
    const contracts = await db.findContractsByUserId(session.user.id, {
      status: "PENDING",
      skip: (page - 1) * limit,
      take: limit,
    })

    // 计算等待天数
    const contractsWithWaitingDays = contracts.map((contract) => {
      const daysWaiting = Math.floor(
        (new Date().getTime() - new Date(contract.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      )
      return {
        ...contract,
        daysWaiting,
      }
    })

    // 获取总数
    const total = await db.countContracts(session.user.id, "PENDING")

    return NextResponse.json({
      contracts: contractsWithWaitingDays,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("获取待签署合同失败:", error)
    return NextResponse.json({ error: "获取待签署合同失败" }, { status: 500 })
  }
}
