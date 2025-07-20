import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, templateId, content, type } = body

    if (!title) {
      return NextResponse.json({ error: "合同标题不能为空" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: "合同内容不能为空" }, { status: 400 })
    }

    // 生成合同ID
    const timestamp = Date.now()
    const contractId = `contract_${timestamp}`

    // 创建合同数据
    const contractData = {
      id: contractId,
      title,
      description: description || '',
      content,
      type: type || 'template',
      status: 'DRAFT',
      userId: session.user.id,
      templateId: templateId || null,
      metadata: {
        createdFrom: 'template',
        templateId: templateId,
        createdAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 这里应该调用数据库服务来创建合同
    // 暂时模拟创建成功
    console.log('从模板创建合同:', contractData)

    return NextResponse.json({
      success: true,
      contractId,
      message: "合同创建成功",
      contract: contractData
    })

  } catch (error) {
    console.error('创建合同失败:', error)
    return NextResponse.json(
      { error: "创建合同失败" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "请使用POST方法创建合同" }, { status: 405 })
}
