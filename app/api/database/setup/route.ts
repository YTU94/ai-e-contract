import { NextResponse } from "next/server"
import { setupDatabase, seedDatabase } from "@/lib/database-setup"

export async function POST() {
  try {
    // 设置数据库连接
    const setupResult = await setupDatabase()
    if (!setupResult.success) {
      return NextResponse.json({ error: "数据库连接失败", details: setupResult.error }, { status: 500 })
    }

    // 初始化数据
    const seedResult = await seedDatabase()
    if (!seedResult.success) {
      return NextResponse.json({ error: "数据库初始化失败", details: seedResult.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "数据库设置完成",
      userCount: setupResult.userCount,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ error: "数据库设置失败", details: error }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await setupDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "数据库状态检查失败", details: error }, { status: 500 })
  }
}
