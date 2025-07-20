"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Send, 
  Bot, 
  User, 
  ArrowLeft,
  Download,
  Share,
  Edit,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  category?: "summary" | "risk" | "sign" | "edit" | "general"
}

interface Contract {
  id: string
  title: string
  content: string
  status: string
  type: string
  createdAt: string
  pdfUrl?: string
}

const AI_FEATURES = [
  {
    id: "summary",
    title: "合同摘要",
    description: "生成合同关键信息摘要",
    icon: FileText,
    color: "blue"
  },
  {
    id: "risk",
    title: "风险提示", 
    description: "识别合同潜在风险点",
    icon: AlertTriangle,
    color: "orange"
  },
  {
    id: "sign",
    title: "快速签约",
    description: "引导完成合同签署流程",
    icon: CheckCircle,
    color: "green"
  },
  {
    id: "edit",
    title: "智能修改",
    description: "AI辅助合同条款修改",
    icon: Edit,
    color: "purple"
  }
]

export default function ContractPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    fetchContract()
    initializeAIChat()
  }, [contractId])

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`)
      if (response.ok) {
        const data = await response.json()
        setContract(data)
      }
    } catch (error) {
      console.error("获取合同失败:", error)
    }
  }

  const initializeAIChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: `欢迎使用AI合同助手！我可以帮您：

🔍 **合同摘要** - 快速了解合同核心内容
⚠️ **风险提示** - 识别潜在法律风险
✅ **快速签约** - 引导完成签署流程  
✏️ **智能修改** - 协助优化合同条款

请选择您需要的功能，或直接提问！`,
      timestamp: new Date(),
      category: "general"
    }
    setMessages([welcomeMessage])
  }

  const handleAIFeature = async (featureId: string) => {
    if (!contract) return

    setIsAnalyzing(true)
    
    const feature = AI_FEATURES.find(f => f.id === featureId)
    if (!feature) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user", 
      content: `请为我提供${feature.title}`,
      timestamp: new Date(),
      category: featureId as any
    }

    setMessages(prev => [...prev, userMessage])

    try {
      // 模拟AI分析
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let aiResponse = ""
      
      switch (featureId) {
        case "summary":
          aiResponse = `📋 **合同摘要分析**

**合同类型**: ${contract.type}
**合同标题**: ${contract.title}
**创建时间**: ${new Date(contract.createdAt).toLocaleDateString()}

**核心条款**:
• 合同双方权利义务明确
• 付款条件和时间节点清晰
• 违约责任条款完整
• 争议解决机制明确

**建议**: 合同结构完整，条款表述清晰，建议仔细核对具体金额和时间节点。`
          break
          
        case "risk":
          aiResponse = `⚠️ **风险分析报告**

**高风险项** (需要重点关注):
🔴 付款条件可能存在资金风险
🔴 违约金条款可能过于严苛

**中风险项** (建议优化):
🟡 部分条款表述不够明确
🟡 缺少不可抗力条款

**低风险项** (可接受):
🟢 合同主体资格清晰
🟢 履行期限合理

**建议**: 重点关注付款安全，建议增加担保措施。`
          break
          
        case "sign":
          aiResponse = `✅ **签约流程指导**

**签署前检查清单**:
☑️ 确认合同双方信息准确
☑️ 核对金额、日期等关键数据
☑️ 确认具有签署权限
☑️ 保留合同副本

**签署步骤**:
1. 仔细阅读全部条款
2. 确认无误后进行电子签名
3. 下载已签署合同存档
4. 设置履约提醒

**注意事项**: 签署后合同即生效，请确保充分理解所有条款。`
          break
          
        case "edit":
          aiResponse = `✏️ **智能修改建议**

**可优化条款**:
📝 第3条付款条款 - 建议增加分期付款选项
📝 第7条违约责任 - 建议调整违约金比例
📝 第12条争议解决 - 建议增加调解程序

**修改建议**:
• 在付款条款中增加"分期付款经双方协商一致可调整"
• 将违约金比例从20%调整为10%
• 增加"争议发生时应先通过友好协商解决"

**修改后效果**: 降低履约风险，增加合同灵活性。`
          break
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        category: featureId as any
      }

      setMessages(prev => [...prev, assistantMessage])
      
    } catch (error) {
      console.error("AI分析失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !contract) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsAnalyzing(true)

    try {
      // 模拟AI回复
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: `我理解您的问题。基于当前合同内容，我的建议是：

这是一个关于"${inputMessage}"的问题。根据合同条款分析，建议您注意以下几点：

1. 确保相关条款符合法律法规要求
2. 核实具体的执行细节和时间安排
3. 如有疑问建议咨询专业法律顾问

您还有其他问题吗？我可以为您提供更详细的分析。`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
    } catch (error) {
      console.error("发送消息失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>加载合同中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/contracts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回合同列表
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{contract.title}</h1>
                <p className="text-sm text-gray-500">合同预览与AI分析</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              分享
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* 左侧：PDF预览区 (2/3) */}
          <div className="col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>合同预览</span>
                  </span>
                  <Badge variant="secondary">{contract.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  {contract.pdfUrl ? (
                    <iframe
                      src={contract.pdfUrl}
                      className="w-full h-full rounded-lg"
                      title="PDF预览"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">PDF预览</p>
                      <p className="text-sm text-gray-500">
                        {contract.content.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：AI对话区 (1/3) */}
          <div className="col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>AI智能助手</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* AI功能快捷按钮 */}
                <div className="p-4 border-b">
                  <div className="grid grid-cols-2 gap-2">
                    {AI_FEATURES.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 flex flex-col items-center space-y-1"
                        onClick={() => handleAIFeature(feature.id)}
                        disabled={isAnalyzing}
                      >
                        <feature.icon className="h-4 w-4" />
                        <span className="text-xs">{feature.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 消息列表 */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === "assistant" && (
                              <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            {message.type === "user" && (
                              <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              <div className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isAnalyzing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4" />
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI正在分析中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* 输入区域 */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="询问合同相关问题..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isAnalyzing}
                      rows={2}
                      className="resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isAnalyzing}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
