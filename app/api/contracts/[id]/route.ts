import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { db } from "@/lib/database"

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

    // 从数据库获取合同信息
    const contract = await db.findContractById(contractId)
    
    if (!contract) {
      return NextResponse.json({ error: "合同未找到" }, { status: 404 })
    }

    // 验证用户权限（只能查看自己的合同）
    if (contract.userId !== session.user.id) {
      return NextResponse.json({ error: "无权访问此合同" }, { status: 403 })
    }

    return NextResponse.json(contract)

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

    // 验证合同存在
    const existingContract = await db.findContractById(contractId)
    if (!existingContract) {
      return NextResponse.json({ error: "合同未找到" }, { status: 404 })
    }

    // 验证用户权限
    if (existingContract.userId !== session.user.id) {
      return NextResponse.json({ error: "无权修改此合同" }, { status: 403 })
    }

    // 更新数据库中的合同信息
    const updatedContract = await db.updateContract(contractId, {
      ...body,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "合同更新成功",
      contract: updatedContract
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

    // 验证合同存在
    const existingContract = await db.findContractById(contractId)
    if (!existingContract) {
      return NextResponse.json({ error: "合同未找到" }, { status: 404 })
    }

    // 验证用户权限
    if (existingContract.userId !== session.user.id) {
      return NextResponse.json({ error: "无权删除此合同" }, { status: 403 })
    }

    // 从数据库删除合同
    // 注意：实际项目中可能需要软删除或关联删除签名等
    await db.updateContract(contractId, {
      status: "CANCELLED",
      updatedAt: new Date(),
    })

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
