import { NextResponse } from "next/server"
import { AIContractService } from "@/services/AIContractService"

export async function POST(request: Request) {
  const { content } = await request.json()

  const result = await AIContractService.analyzeContract(content)

  return NextResponse.json({
    success: result.success,
    analysis: result.analysis,
    provider: result.provider,
    model: result.model,
    error: result.error,
  })
}
