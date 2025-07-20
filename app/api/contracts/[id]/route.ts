import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const contractId = params.id

    // 这里应该从数据库获取合同信息
    // 暂时返回模拟数据
    const mockContract = {
      id: contractId,
      title: "销售合同示例",
      content: `这是一份销售合同的示例内容。

第一条 合同双方
甲方：示例公司
乙方：客户公司

第二条 合同标的
本合同标的为商品销售服务。

第三条 价格条款
合同总价为人民币100,000元整。

第四条 付款方式
采用分期付款方式，首付30%，余款在交付时支付。

第五条 交付条款
甲方应在合同签署后30日内完成交付。

第六条 质量保证
甲方保证所提供商品符合国家相关标准。

第七条 违约责任
任何一方违约，应承担违约金为合同总价的10%。

第八条 争议解决
因本合同引起的争议，双方应友好协商解决。

第九条 其他条款
本合同一式两份，双方各执一份，具有同等法律效力。

第十条 生效条款
本合同自双方签字盖章之日起生效。`,
      status: "DRAFT",
      type: "销售合同",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id,
      pdfUrl: null, // 如果是PDF上传的合同，这里会有PDF URL
      metadata: {
        createdFrom: "template",
        fileSize: null,
        originalFileName: null
      }
    }

    return NextResponse.json(mockContract)

  } catch (error) {
    console.error('获取合同失败:', error)
    return NextResponse.json(
      { error: "获取合同失败" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const contractId = params.id
    const body = await req.json()

    // 这里应该更新数据库中的合同信息
    console.log('更新合同:', contractId, body)

    return NextResponse.json({
      success: true,
      message: "合同更新成功"
    })

  } catch (error) {
    console.error('更新合同失败:', error)
    return NextResponse.json(
      { error: "更新合同失败" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const contractId = params.id

    // 这里应该从数据库删除合同
    console.log('删除合同:', contractId)

    return NextResponse.json({
      success: true,
      message: "合同删除成功"
    })

  } catch (error) {
    console.error('删除合同失败:', error)
    return NextResponse.json(
      { error: "删除合同失败" },
      { status: 500 }
    )
  }
}
