import { AIContractService } from "@/lib/ai-service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 })
    }

    const aiContractService = new AIContractService()
    const response = await aiContractService.chat(messages)

    return NextResponse.json(response)
  } catch (error) {
    console.log("[CONTRACT_CHAT_QUERY_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
