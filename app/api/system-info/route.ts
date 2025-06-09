import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const dbType = db.getDatabaseType()
    const isConnected = await db.testConnection()

    const systemInfo = {
      database: {
        type: dbType,
        connected: isConnected,
        description:
          dbType === "mock" ? "Using in-memory mock database for v0 preview" : "Using Vercel Postgres database",
      },
      environment: process.env.NODE_ENV,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get system info", details: error }, { status: 500 })
  }
}
