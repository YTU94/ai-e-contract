import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/database"

const registerSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少需要8个字符"),
  company: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, company } = registerSchema.parse(body)

    // 检查用户是否已存在
    const existingUser = await db.findUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 })
    }

    // 加密密码
    const hashedPassword = await hash(password, 12)

    // 创建用户
    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      company,
      role: "USER",
    })

    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "请求数据格式错误",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 })
  }
}
