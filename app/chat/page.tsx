"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Send, BarChart3, Loader2, Bot, User, Sparkles, FileSignature, Search, Wand2 } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "contract" | "analysis" | "signature"
  metadata?: any
}

const suggestedPrompts = [
  {
    icon: Search,
    title: "查询合同",
    description: "搜索和查看我的电子合同",
    prompt: "帮我查看最近的合同列表",
  },
  {
    icon: Wand2,
    title: "创建合同",
    description: "智能生成新的电子合同",
    prompt: "我想创建一份软件开发服务合同",
  },
  {
    icon: FileSignature,
    title: "合同签署",
    description: "为合同添加电子签名",
    prompt: "帮我给合同添加电子签名",
  },
  {
    icon: BarChart3,
    title: "合同分析",
    description: "分析合同条款和风险",
    prompt: "分析我最近签署的合同有什么风险点",
  },
]

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // 添加欢迎消息
    if (session?.user && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `你好 ${session.user.name}！我是 ContractAI 智能助手。我可以帮助您：

🔍 **查询合同** - 搜索和查看您的电子合同
📝 **创建合同** - 智能生成各类电子合同
✍️ **合同签署** - 为合同添加电子签名
📊 **合同分析** - 分析合同条款和风险点

请告诉我您需要什么帮助，或者点击下方的建议开始对话！`,
        timestamp: new Date(),
        type: "text",
      }
      setMessages([welcomeMessage])
    }
  }, [session, messages.length])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10), // 只发送最近10条消息作为上下文
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "发送消息失败")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        type: data.type || "text",
        metadata: data.metadata,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，我遇到了一些问题。请稍后再试。",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ContractAI</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI 助手
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                仪表板
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始对话</h3>
              <p className="text-gray-500">选择下方的建议或直接输入您的问题</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.role === "user" ? session?.user?.name || "您" : "ContractAI"}
                    </span>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>

                  <Card className={`${message.role === "user" ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
                    <CardContent className="p-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800">{message.content}</div>

                        {/* 特殊内容类型的渲染 */}
                        {message.type === "contract" && message.metadata && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{message.metadata.title}</span>
                              </div>
                              <Button size="sm" variant="outline">
                                查看详情
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-blue-100">
                  <Bot className="h-4 w-4 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-gray-600">正在思考...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-blue-300"
                  onClick={() => handleSendMessage(prompt.prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <prompt.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{prompt.title}</h4>
                        <p className="text-sm text-gray-600">{prompt.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Input Area */}
        <div className="p-4 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="min-h-[44px] resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-[44px] px-4"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-2 text-xs text-gray-500 text-center">ContractAI 可能会出错。请核实重要信息。</div>
        </div>
      </div>
    </div>
  )
}
