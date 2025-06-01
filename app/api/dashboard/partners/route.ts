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

    // 从签名记录中获取合作伙伴信息
    const signatures = await prisma.signature.findMany({
      where: {
        contract: {
          userId: session.user.id,
        },
      },
      select: {
        signerName: true,
        signerEmail: true,
        signedAt: true,
        contract: {
          select: {
            id: true,
            status: true,
            metadata: true,
          },
        },
      },
    })

    // 按邮箱分组统计合作伙伴
    const partnersMap = new Map()

    signatures.forEach((signature) => {
      const email = signature.signerEmail
      if (!partnersMap.has(email)) {
        partnersMap.set(email, {
          id: email, // 使用邮箱作为临时ID
          name: signature.signerName,
          company: signature.signerName.split(" ")[0] + " 公司", // 临时公司名
          email: email,
          phone: undefined,
          contractsCount: 0,
          totalValue: 0,
          lastContractDate: signature.signedAt,
          status: "active" as const,
        })
      }

      const partner = partnersMap.get(email)
      partner.contractsCount += 1

      // 累计合同金额
      if (signature.contract.metadata?.totalValue) {
        partner.totalValue += signature.contract.metadata.totalValue
      }

      // 更新最近合作时间
      if (new Date(signature.signedAt) > new Date(partner.lastContractDate)) {
        partner.lastContractDate = signature.signedAt
      }

      // 判断是否活跃（30天内有合作）
      const daysSinceLastContract = Math.floor(
        (new Date().getTime() - new Date(signature.signedAt).getTime()) / (1000 * 60 * 60 * 24),
      )
      if (daysSinceLastContract <= 30) {
        partner.status = "active"
      } else {
        partner.status = "inactive"
      }
    })

    // 转换为数组并排序
    const partners = Array.from(partnersMap.values()).sort((a, b) => b.contractsCount - a.contractsCount)

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
