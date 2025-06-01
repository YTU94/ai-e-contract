"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle, Loader2, Zap } from "lucide-react"

interface AIStatus {
  available: boolean
  model: string
  error?: string
}

export function AIStatusChecker() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<string>("")

  const checkAIStatus = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "请用一句话介绍人工智能在合同管理中的应用。",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          available: true,
          model: "GPT-4o",
        })
        setTestResult(data.result)
      } else {
        setStatus({
          available: false,
          model: "N/A",
          error: data.error,
        })
      }
    } catch (error) {
      setStatus({
        available: false,
        model: "N/A",
        error: "连接失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAIStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI 服务状态</span>
        </CardTitle>
        <CardDescription>OpenAI GPT-4 服务连接状态</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="flex items-center space-x-2">
            {status.available ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  服务正常
                </Badge>
                <span className="text-sm text-gray-600">模型: {status.model}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <Badge variant="destructive">服务异常</Badge>
              </>
            )}
          </div>
        )}

        {status && !status.available && status.error && (
          <Alert variant="destructive">
            <AlertDescription>AI 服务错误: {status.error}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">AI 测试响应:</p>
            <p className="text-sm text-blue-800">{testResult}</p>
          </div>
        )}

        <Button onClick={checkAIStatus} disabled={isLoading} variant="outline" size="sm">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Zap className="mr-2 h-4 w-4" />
          测试 AI 服务
        </Button>

        <div className="text-sm text-gray-600 space-y-1">
          <p>• 智能合同分析和风险识别</p>
          <p>• 自动生成合同条款建议</p>
          <p>• 合同内容智能摘要</p>
          <p>• 法律条款合规性检查</p>
        </div>
      </CardContent>
    </Card>
  )
}
