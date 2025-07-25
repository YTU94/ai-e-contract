import { NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    const contract = await AIContractService.generateContract("合同", prompt)

    return NextResponse.json({ contract })
  } catch (error) {
    console.log("[CONTRACT_GENERATE_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
