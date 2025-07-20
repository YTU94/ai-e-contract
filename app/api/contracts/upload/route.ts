import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "合同标题不能为空" }, { status: 400 })
    }

    // 验证文件类型
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "只支持PDF文件" }, { status: 400 })
    }

    // 验证文件大小 (50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "文件大小不能超过50MB" }, { status: 400 })
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'contracts')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadDir, fileName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 生成文件URL
    const fileUrl = `/uploads/contracts/${fileName}`

    // 创建合同记录
    const contractData = {
      title,
      description: description || '',
      type: type || 'uploaded',
      content: `PDF文件: ${file.name}`,
      status: 'DRAFT',
      userId: session.user.id,
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        fileUrl: fileUrl,
        uploadedAt: new Date().toISOString()
      }
    }

    // 这里应该调用数据库服务来创建合同
    // 暂时模拟创建成功
    const contractId = `contract_${timestamp}`

    // 模拟数据库操作
    console.log('创建合同:', contractData)

    return NextResponse.json({
      success: true,
      contractId,
      message: "合同创建成功",
      contract: {
        id: contractId,
        ...contractData,
        pdfUrl: fileUrl
      }
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: "文件上传失败" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "请使用POST方法上传文件" }, { status: 405 })
}
