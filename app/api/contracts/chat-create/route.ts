import { AIContractService } from "@/lib/ai-service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, contractId } = body

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    if (!contractId) {
      return new NextResponse("Contract ID is required", { status: 400 })
    }

    const aiContractService = new AIContractService()
    const chat = await aiContractService.createChat(userId, contractId)

    return NextResponse.json(chat)
  } catch (error) {
    console.log("[CHAT_CREATE_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
