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

    // 获取已完成合同
    const contracts = await db.findContractsByUserId(session.user.id, {
      status: "COMPLETED",
      skip: (page - 1) * limit,
      take: limit,
    })

    // 处理数据，添加签名数量和完成时间
    const contractsWithDetails = await Promise.all(
      contracts.map(async (contract) => {
        const signatures = await db.findSignaturesByContractId(contract.id)
        const lastSignature = signatures.sort(
          (a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime(),
        )[0]

        return {
          id: contract.id,
          title: contract.title,
          type: contract.type,
          status: contract.status,
          completedAt: lastSignature?.signedAt || contract.updatedAt,
          signaturesCount: signatures.length,
          totalValue: contract.metadata?.totalValue || null,
        }
      }),
    )

    // 获取总数
    const total = await db.countContracts(session.user.id, "COMPLETED")

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
