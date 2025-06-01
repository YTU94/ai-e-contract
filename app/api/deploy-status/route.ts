import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 检查部署状态和环境变量
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      nextauthUrl: process.env.NEXTAUTH_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
      hasOpenaiKey: !!process.env.OPENAI_API_KEY,
    }

    const allConfigured =
      deploymentInfo.hasDirectUrl &&
      deploymentInfo.hasDatabaseUrl &&
      deploymentInfo.hasNextauthSecret &&
      deploymentInfo.hasOpenaiKey

    return NextResponse.json({
      success: allConfigured,
      deployment: deploymentInfo,
      message: allConfigured ? "所有环境变量配置完成" : "部分环境变量缺失",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check deployment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
