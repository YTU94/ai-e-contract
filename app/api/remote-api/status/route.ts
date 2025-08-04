import { NextResponse } from "next/server"
import { remoteAPIClient, getAPIStatus } from "@/lib/remote-api-config"

export async function GET() {
  try {
    const status = getAPIStatus()
    
    // 如果远程API已启用，测试连接
    let connectionTest = null
    if (status.enabled && status.configured) {
      connectionTest = await remoteAPIClient.testConnection()
    }

    return NextResponse.json({
      success: true,
      status,
      connectionTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[REMOTE_API_STATUS_ERROR]", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check remote API status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === "test") {
      const result = await remoteAPIClient.testConnection()
      return NextResponse.json({
        success: true,
        result,
        timestamp: new Date().toISOString(),
      })
    }

    if (action === "health") {
      const result = await remoteAPIClient.healthCheck()
      return NextResponse.json({
        success: true,
        result,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("[REMOTE_API_ACTION_ERROR]", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute remote API action",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
