"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle, Loader2, Zap, Info } from "lucide-react"

interface AIStatus {
  available: boolean
  provider: string
  model: string
  baseURL?: string
  error?: string
}

interface AITestResult {
  success: boolean
  result?: string
  provider?: string
  model?: string
  error?: string
}

export function AIStatusChecker() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<AITestResult | null>(null)

  const checkAIInfo = async () => {
    try {
      const response = await fetch("/api/ai/test", {
        method: "GET",
      })
      const data = await response.json()

      if (response.ok && data.success) {
        setStatus({
          available: data.available,
          provider: data.provider,
          model: data.model,
          baseURL: data.baseURL,
          error: data.error,
        })
      } else {
        setStatus({
          available: false,
          provider: "none",
          model: "N/A",
          error: data.error || "获取 AI 信息失败",
        })
      }
    } catch (error) {
      setStatus({
        available: false,
        provider: "none",
        model: "N/A",
        error: "连接失败",
      })
    }
  }

  const testAIService = async () => {
    setIsLoading(true)
    setTestResult(null)

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

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          result: data.result,
          provider: data.provider,
          model: data.model,
        })
      } else {
        setTestResult({
          success: false,
          error: data.error || "测试失败",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: "连接失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAIInfo()
  }, [])

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case "deepseek":
        return "DeepSeek"
      case "openai":
        return "OpenAI"
      default:
        return provider
    }
  }

  const getModelDisplayName = (model: string) => {
    switch (model) {
      case "deepseek-chat":
        return "DeepSeek Chat"
      case "gpt-4o":
        return "GPT-4o"
      default:
        return model
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI 服务状态</span>
        </CardTitle>
        <CardDescription>AI 模型服务连接状态</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {status.available ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    服务正常
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">服务异常</Badge>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">服务商:</span>
                <span className="ml-2">{getProviderDisplayName(status.provider)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">模型:</span>
                <span className="ml-2">{getModelDisplayName(status.model)}</span>
              </div>
              {status.baseURL && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">API 地址:</span>
                  <span className="ml-2 text-xs text-blue-600">{status.baseURL}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {status && !status.available && status.error && (
          <Alert variant="destructive">
            <AlertDescription>AI 服务错误: {status.error}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <div className={`p-3 rounded-lg ${testResult.success ? "bg-blue-50" : "bg-red-50"}`}>
            {testResult.success ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm font-medium text-blue-900">AI 测试响应:</p>
                  {testResult.provider && (
                    <Badge variant="outline" className="text-xs">
                      {getProviderDisplayName(testResult.provider)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-blue-800">{testResult.result}</p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-800">测试失败: {testResult.error}</p>
              </div>
            )}
          </div>
        )}

        <Button onClick={testAIService} disabled={isLoading} variant="outline" size="sm">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Zap className="mr-2 h-4 w-4" />
          测试 AI 服务
        </Button>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">支持的 AI 功能</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 智能合同分析和风险识别</p>
            <p>• 自动生成合同条款建议</p>
            <p>• 合同内容智能摘要</p>
            <p>• 法律条款合规性检查</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">配置说明</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• 优先使用 DEEPSEEK_API_KEY（DeepSeek API）</p>
            <p>• 回退使用 OPENAI_API_KEY（OpenAI API）</p>
            <p>• DeepSeek 提供更经济的 AI 服务</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
