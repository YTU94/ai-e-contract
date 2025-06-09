import { NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export async function GET(request: Request) {
  try {
    const aiContractService = new AIContractService()
    const result = await aiContractService.testFunction()

    return NextResponse.json({ message: "AI Test Route", result })
  } catch (error: any) {
    console.error("Error in /api/ai/test:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
