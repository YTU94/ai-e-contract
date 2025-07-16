"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Upload, 
  FileText, 
  Send, 
  Bot, 
  User, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Download
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AnalysisResult {
  summary?: string
  risks?: string[]
  compliance?: { status: "pass" | "warning" | "fail", details: string }
  keyTerms?: string[]
}

export default function ContractUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPdfUrl(url)
      
      // 添加系统消息
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `已成功上传合同文件：${selectedFile.name}。我可以帮您进行以下分析：\n\n• 📋 合同摘要总结\n• ⚠️ 风险识别分析\n• ✅ 合规性审查\n• 🔍 关键条款定位\n\n请告诉我您需要什么帮助？`,
        timestamp: new Date()
      }
      setMessages([systemMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !file) return

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
      // 模拟AI分析
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("分析失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes("摘要") || lowerQuery.includes("总结")) {
      return `📋 **合同摘要分析**\n\n**合同类型：** 软件开发服务合同\n**合同期限：** 2024年1月1日 - 2024年12月31日\n**合同金额：** 人民币50万元\n**付款方式：** 分三期支付\n\n**主要条款：**\n• 开发周期：6个月\n• 交付标准：符合需求文档规范\n• 知识产权：归甲方所有\n• 保密期限：5年\n\n**关键时间节点：**\n• 需求确认：合同签署后7天内\n• 原型交付：第2个月末\n• 最终交付：第6个月末`
    }
    
    if (lowerQuery.includes("风险") || lowerQuery.includes("问题")) {
      return `⚠️ **风险识别分析**\n\n**高风险项：**\n• 交付标准描述不够具体，可能产生争议\n• 缺少延期交付的违约责任条款\n\n**中风险项：**\n• 变更管理流程不够详细\n• 验收标准需要进一步明确\n\n**建议：**\n1. 补充详细的功能验收标准\n2. 增加里程碑式的阶段性交付条款\n3. 明确双方的变更审批流程`
    }
    
    if (lowerQuery.includes("合规") || lowerQuery.includes("审查")) {
      return `✅ **合规性审查报告**\n\n**整体评估：** 🟡 基本合规，需要完善\n\n**法律合规性：**\n• ✅ 合同主体资格合规\n• ✅ 合同内容不违反法律法规\n• ⚠️ 争议解决条款建议完善\n\n**商业合规性：**\n• ✅ 价格条款合理\n• ✅ 付款条件可接受\n• ⚠️ 知识产权条款需要细化\n\n**建议修改：**\n1. 增加不可抗力条款\n2. 完善保密协议细节\n3. 明确数据安全责任`
    }
    
    return `我已收到您的问题："${query}"。\n\n基于当前合同内容，我可以为您提供：\n\n• 📋 详细的合同摘要分析\n• ⚠️ 潜在风险识别\n• ✅ 合规性审查报告\n• 🔍 特定条款快速定位\n\n请告诉我您具体需要哪方面的分析？`
  }

  const quickActions = [
    { label: "合同摘要", action: () => setInputMessage("请为我总结这份合同的主要内容") },
    { label: "风险分析", action: () => setInputMessage("请分析这份合同的潜在风险") },
    { label: "合规审查", action: () => setInputMessage("请进行合规性审查") },
    { label: "关键条款", action: () => setInputMessage("请帮我找出关键条款") }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">合同上传分析</span>
            </div>
          </div>
          {file && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              下载分析报告
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* 左侧：文件上传和预览区 (2/3) */}
          <div className="col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>合同文件预览</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                {!file ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg h-full flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">上传PDF合同文件</p>
                    <p className="text-sm text-gray-500 mb-4">点击或拖拽文件到此区域</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      选择文件
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{file.name}</span>
                        <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        更换文件
                      </Button>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full rounded-lg"
                        title="PDF预览"
                      />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：AI对话界面 (1/3) */}
          <div className="col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI 智能分析</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* 快捷操作 */}
                {file && (
                  <div className="p-4 border-b">
                    <p className="text-sm text-gray-600 mb-3">快捷分析：</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 消息列表 */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>上传合同文件后开始AI分析</p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
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
                            <div className="flex-1">
                              <pre className="whitespace-pre-wrap text-sm font-sans">
                                {message.content}
                              </pre>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
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
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
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
                      placeholder={file ? "询问合同相关问题..." : "请先上传合同文件"}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={!file || isAnalyzing}
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
                      disabled={!file || !inputMessage.trim() || isAnalyzing}
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