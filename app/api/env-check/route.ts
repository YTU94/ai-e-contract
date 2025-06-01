import { NextResponse } from "next/server"

export async function GET() {
  try {
    const envStatus = {
      DATABASE_URL: {
        configured: !!process.env.DATABASE_URL,
        valid:
          process.env.DATABASE_URL?.startsWith("postgres://") || process.env.DATABASE_URL?.startsWith("postgresql://"),
        masked: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 20)}...` : "Not set",
      },
      DIRECT_URL: {
        configured: !!process.env.DIRECT_URL,
        valid: process.env.DIRECT_URL?.startsWith("postgres://") || process.env.DIRECT_URL?.startsWith("postgresql://"),
        masked: process.env.DIRECT_URL ? `${process.env.DIRECT_URL.substring(0, 20)}...` : "Not set",
      },
      NEXTAUTH_SECRET: {
        configured: !!process.env.NEXTAUTH_SECRET,
        valid: (process.env.NEXTAUTH_SECRET?.length || 0) >= 32,
        masked: process.env.NEXTAUTH_SECRET ? `${process.env.NEXTAUTH_SECRET.substring(0, 8)}...` : "Not set",
      },
      NEXTAUTH_URL: {
        configured: !!process.env.NEXTAUTH_URL,
        valid: process.env.NEXTAUTH_URL?.startsWith("http"),
        value: process.env.NEXTAUTH_URL || "Not set",
      },
      OPENAI_API_KEY: {
        configured: !!process.env.OPENAI_API_KEY,
        valid: process.env.OPENAI_API_KEY?.startsWith("sk-"),
        masked: process.env.OPENAI_API_KEY ? `sk-...${process.env.OPENAI_API_KEY.slice(-4)}` : "Not set",
      },
      NODE_ENV: {
        configured: !!process.env.NODE_ENV,
        value: process.env.NODE_ENV || "Not set",
      },
    }

    const allConfigured = Object.values(envStatus).every((env) => env.configured)
    const allValid = Object.values(envStatus).every((env) => env.valid !== false)

    return NextResponse.json({
      success: allConfigured && allValid,
      environment: process.env.NODE_ENV,
      variables: envStatus,
      summary: {
        total: Object.keys(envStatus).length,
        configured: Object.values(envStatus).filter((env) => env.configured).length,
        valid: Object.values(envStatus).filter((env) => env.valid !== false).length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
