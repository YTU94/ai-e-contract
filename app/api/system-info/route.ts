import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getAPIStatus } from "@/lib/remote-api-config"
import { AIContractService } from "@/lib/ai-service"

export async function GET() {
  try {
    const dbType = db.getDatabaseType()
    const isConnected = await db.testConnection()

    // 获取远程API状态
    const remoteAPIStatus = getAPIStatus()

    // 获取AI服务信息
    const aiInfo = AIContractService.getAIInfo()

    const systemInfo = {
      database: {
        type: dbType,
        connected: isConnected,
        description:
          dbType === "mock" ? "Using in-memory mock database for v0 preview" : "Using Vercel Postgres database",
      },
      ai: {
        available: aiInfo.available,
        provider: aiInfo.provider,
        model: aiInfo.model,
        source: aiInfo.source || "local",
        sdkVersion: aiInfo.sdkVersion,
      },
      remoteAPI: {
        enabled: remoteAPIStatus.enabled,
        configured: remoteAPIStatus.configured,
        baseURL: remoteAPIStatus.baseURL,
        timeout: remoteAPIStatus.timeout,
        environment: remoteAPIStatus.environment,
      },
      environment: process.env.NODE_ENV,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasDeepSeek: !!process.env.DEEPSEEK_API_KEY,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get system info", details: error }, { status: 500 })
  }
}
