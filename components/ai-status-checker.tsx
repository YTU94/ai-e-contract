"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, CheckCircle, XCircle, Loader2, Zap, Info, Clock, TestTube } from "lucide-react"

interface AIStatus {
  available: boolean
  provider: string
  model: string
  sdkVersion?: string
  error?: string
}

interface AITestResult {
  success: boolean
  result?: string
  provider?: string
  model?: string
  error?: string
  timestamp?: string
}

interface PerformanceTestResult {
  success: boolean
  provider?: string
  model?: string
  totalTime?: number
  averageTime?: number
  results?: Array<{
    prompt: string
    response: string
    responseTime: number
  }>
  error?: string
}

export function AIStatusChecker() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<AITestResult | null>(null)
  const [perfResult, setPerfResult] = useState<PerformanceTestResult | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")

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
          sdkVersion: data.sdkVersion,
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

  const runBasicTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "basic",
          prompt: "请用一句话介绍人工智能在合同管理中的应用。",
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "连接失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runPerformanceTest = async () => {
    setIsLoading(true)
    setPerfResult(null)

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "performance",
        }),
      })

      const data = await response.json()
      setPerfResult(data)
    } catch (error) {
      setPerfResult({
        success: false,
        error: "性能测试失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runCustomTest = async () => {
    if (!customPrompt.trim()) {
      alert("请输入自定义测试提示")
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "custom",
          prompt: customPrompt,
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "自定义测试失败",
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
        <CardDescription>DeepSeek AI 模型服务连接状态和测试</CardDescription>
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
              {status.sdkVersion && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">SDK:</span>
                  <span className="ml-2 text-xs text-blue-600">{status.sdkVersion}</span>
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

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基础测试</TabsTrigger>
            <TabsTrigger value="performance">性能测试</TabsTrigger>
            <TabsTrigger value="custom">自定义测试</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Button onClick={runBasicTest} disabled={isLoading} variant="outline" size="sm">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Zap className="mr-2 h-4 w-4" />
              运行基础测试
            </Button>

            {testResult && (
              <div className={`p-3 rounded-lg ${testResult.success ? "bg-blue-50" : "bg-red-50"}`}>
                {testResult.success ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-blue-900">AI 测试响应:</p>
                        {testResult.provider && (
                          <Badge variant="outline" className="text-xs">
                            {getProviderDisplayName(testResult.provider)}
                          </Badge>
                        )}
                      </div>
                      {testResult.timestamp && (
                        <span className="text-xs text-gray-500">
                          {new Date(testResult.timestamp).toLocaleTimeString()}
                        </span>
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
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Button onClick={runPerformanceTest} disabled={isLoading} variant="outline" size="sm">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Clock className="mr-2 h-4 w-4" />
              运行性能测试
            </Button>

            {perfResult && (
              <div className={`p-3 rounded-lg ${perfResult.success ? "bg-green-50" : "bg-red-50"}`}>
                {perfResult.success ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-green-900">性能测试结果</h4>
                      <Badge variant="outline" className="text-xs">
                        {getProviderDisplayName(perfResult.provider || "")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">总耗时:</span>
                        <span className="ml-2">{perfResult.totalTime}ms</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">平均耗时:</span>
                        <span className="ml-2">{Math.round(perfResult.averageTime || 0)}ms</span>
                      </div>
                    </div>

                    {perfResult.results && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-700">详细结果:</h5>
                        {perfResult.results.map((result, index) => (
                          <div key={index} className="text-xs bg-white p-2 rounded border">
                            <div className="font-medium text-gray-600 mb-1">
                              测试 {index + 1} ({result.responseTime}ms)
                            </div>
                            <div className="text-gray-500 mb-1">提示: {result.prompt}</div>
                            <div className="text-gray-800">{result.response}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-800">性能测试失败: {perfResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">自定义测试提示:</label>
              <Textarea
                placeholder="输入您想要测试的提示内容..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={runCustomTest} disabled={isLoading || !customPrompt.trim()} variant="outline" size="sm">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <TestTube className="mr-2 h-4 w-4" />
              运行自定义测试
            </Button>

            {testResult && (
              <div className={`p-3 rounded-lg ${testResult.success ? "bg-purple-50" : "bg-red-50"}`}>
                {testResult.success ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-purple-900">自定义测试响应:</p>
                        {testResult.provider && (
                          <Badge variant="outline" className="text-xs">
                            {getProviderDisplayName(testResult.provider)}
                          </Badge>
                        )}
                      </div>
                      {testResult.timestamp && (
                        <span className="text-xs text-gray-500">
                          {new Date(testResult.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-800">{testResult.result}</p>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-800">自定义测试失败: {testResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">DeepSeek AI 优势</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 成本效益：相比 OpenAI 节省约 90% 成本</p>
            <p>• 中文优化：专门针对中文场景优化</p>
            <p>• 高性能：快速响应和高质量输出</p>
            <p>• API 兼容：完全兼容 OpenAI API 格式</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">配置说明</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• 使用 @ai-sdk/deepseek 原生 SDK</p>
            <p>• 优先使用 DEEPSEEK_API_KEY</p>
            <p>• 回退使用 OPENAI_API_KEY</p>
            <p>• 支持流式和非流式响应</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
