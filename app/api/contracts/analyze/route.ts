import { NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { contractCode } = await request.json()

    if (!contractCode) {
      return new NextResponse("Contract code is required", { status: 400 })
    }

    const aiContractService = new AIContractService()
    const analysis = await aiContractService.analyzeContract(contractCode)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("[CONTRACT_ANALYZE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
