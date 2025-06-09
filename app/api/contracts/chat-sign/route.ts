import { type NextRequest, NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const aiContractService = new AIContractService()
    const signature = await aiContractService.signMessage(message)

    return NextResponse.json({ signature }, { status: 200 })
  } catch (error) {
    console.error("Error signing message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
