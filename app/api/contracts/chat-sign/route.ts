import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/database-setup"
import { z } from "zod"

const signSchema = z.object({
  contractId: z.string().min(1, "合同ID不能为空"),
  signerName: z.string().min(1, "签名者姓名不能为空"),
  signerEmail: z.string().email("请输入有效的邮箱地址"),
  signature: z.string().min(1, "签名不能为空"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const body = await req.json()
    const { contractId, signerName, signerEmail, signature } = signSchema.parse(body)

    // 验证合同是否存在且属于当前用户
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    })

    if (!contract) {
      return NextResponse.json({ error: "合同不存在或无权限访问" }, { status: 404 })
    }

    // 检查合同状态是否允许签署
    if (contract.status === "SIGNED" || contract.status === "COMPLETED") {
      return NextResponse.json({ error: "合同已签署，无法重复签署" }, { status: 400 })
    }

    // 获取客户端信息
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip")
    const userAgent = req.headers.get("user-agent")

    // 创建签名记录
    const signatureRecord = await prisma.signature.create({
      data: {
        contractId,
        signerName,
        signerEmail,
        signature,
        ipAddress,
        userAgent,
      },
    })

    // 更新合同状态
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "SIGNED",
        updatedAt: new Date(),
      },
    })

    // 记录审计日志
    await createAuditLog(
      "SIGN_CONTRACT",
      "Contract",
      contractId,
      session.user.id,
      {
        signerName,
        signerEmail,
        signatureId: signatureRecord.id,
      },
      req,
    )

    return NextResponse.json({
      success: true,
      message: "合同签署成功",
      contract: {
        id: updatedContract.id,
        title: updatedContract.title,
        status: updatedContract.status,
        signedAt: signatureRecord.signedAt,
      },
      signature: {
        id: signatureRecord.id,
        signerName: signatureRecord.signerName,
        signedAt: signatureRecord.signedAt,
      },
    })
  } catch (error) {
    console.error("Contract signing error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "签署合同失败，请稍后重试" }, { status: 500 })
  }
}
