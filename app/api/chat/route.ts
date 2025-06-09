import { type NextRequest, NextResponse } from "next/server"
import { AIContractService } from "@/lib/ai-service"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { contractType, requirements } = await req.json()

    if (!contractType || !requirements) {
      return NextResponse.json({ error: "Missing contractType or requirements" }, { status: 400 })
    }

    // 在处理合同生成时
    const stream = await AIContractService.streamContractGeneration(contractType, requirements)

    // 添加 AI 服务信息到响应
    const aiInfo = AIContractService.getAIInfo()

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-AI-Service-Name": aiInfo.name,
        "X-AI-Service-Version": aiInfo.version,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: (e as any).message }, { status: 500 })
  }
}
