import { type NextRequest, NextResponse } from "next/server"
import type { Message as VercelChatMessage } from "@vercel/ai"

import { AIMessage, HumanMessage } from "@langchain/core/messages"

import { ChatAnthropic } from "@langchain/anthropic"
import { PromptTemplate } from "@langchain/core/prompts"
import { HttpResponseOutputParser } from "langchain/output_parsers"
import { AIContractService } from "@/lib/ai-service"

export const runtime = "edge"

const convertVercelMessageToLangchainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage({ content: message.content })
  } else if (message.role === "assistant") {
    return new AIMessage({ content: message.content })
  } else {
    throw new Error(`Unknown role: ${message.role}`)
  }
}

const prompt =
  PromptTemplate.fromTemplate(`You are a world class contract lawyer. A user will provide you with a contract, and you will respond with a JSON object containing a summary of the contract, and a list of potential issues with the contract.

  Here is the contract:

  {contract}
`)

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const messages = body.messages as VercelChatMessage[]
    const pineconeIndexName = body.pineconeIndexName as string
    const useCases = body.useCases as string[]

    const langchainMessages = messages.map(convertVercelMessageToLangchainMessage)

    const contract = messages[0].content

    if (!contract) {
      return NextResponse.json({ error: "Missing contract" }, { status: 400 })
    }

    const model = new ChatAnthropic({
      modelName: "claude-3-opus-20240229",
      temperature: 0.2,
    })

    const chain = prompt.pipe(model).pipe(new HttpResponseOutputParser())

    const response = await chain.invoke({
      contract,
    })

    const aiContractService = new AIContractService()

    const insights = await aiContractService.getInsights({
      contractText: contract,
      useCases: useCases,
      indexName: pineconeIndexName,
    })

    return NextResponse.json({ output: response, insights }, { status: 200 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
