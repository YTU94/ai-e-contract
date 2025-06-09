import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST() {
  try {
    const dbType = db.getDatabaseType()

    if (dbType === "mock") {
      // Mock database is always ready
      const userCount = await db.countUsers()
      return NextResponse.json({
        success: true,
        message: "Mock 数据库已准备就绪",
        userCount,
        dbType: "mock",
      })
    }

    // For real database, test connection and setup
    const isConnected = await db.testConnection()
    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: "数据库连接失败",
        },
        { status: 500 },
      )
    }

    const userCount = await db.countUsers()

    return NextResponse.json({
      success: true,
      message: "数据库设置完成",
      userCount,
      dbType: "postgres",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "数据库设置失败",
        details: error,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const isConnected = await db.testConnection()
    const userCount = isConnected ? await db.countUsers() : 0
    const dbType = db.getDatabaseType()

    return NextResponse.json({
      success: isConnected,
      userCount,
      dbType,
      message: isConnected ? `${dbType === "mock" ? "Mock" : "Postgres"} 数据库连接正常` : "数据库连接失败",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "数据库状态检查失败",
        details: error,
      },
      { status: 500 },
    )
  }
}
