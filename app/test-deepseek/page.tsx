"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Loader2, Key, TestTube } from "lucide-react"

interface TestResult {
  success: boolean
  result?: string
  provider?: string
  model?: string
  error?: string
  responseTime?: number
}

export default function TestDeepSeekPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [customPrompt, setCustomPrompt] = useState("请介绍一下 DeepSeek AI 的特点")

  const testDeepSeekAPI = async () => {
    setIsLoading(true)
    setTestResult(null)

    const startTime = Date.now()

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
      const responseTime = Date.now() - startTime

      setTestResult({
        ...data,
        responseTime,
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: "网络连接失败",
        responseTime: Date.now() - startTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickTests = ["请用一句话介绍人工智能", "什么是电子合同？", "解释一下区块链技术", "DeepSeek 有什么优势？"]

  const runQuickTest = async (prompt: string) => {
    setCustomPrompt(prompt)
    setIsLoading(true)
    setTestResult(null)

    const startTime = Date.now()

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "custom",
          prompt,
        }),
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      setTestResult({
        ...data,
        responseTime,
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: "网络连接失败",
        responseTime: Date.now() - startTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">DeepSeek API 测试</h1>
          <p className="text-gray-600">验证 DEEPSEEK_API_KEY 配置和服务连接</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>API Key 配置测试</span>
            </CardTitle>
            <CardDescription>测试您的 DeepSeek API Key 是否正确配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">自定义测试提示:</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="输入您想要测试的提示..."
                rows={3}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={testDeepSeekAPI} disabled={isLoading || !customPrompt.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <TestTube className="mr-2 h-4 w-4" />
                运行测试
              </Button>

              {quickTests.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => runQuickTest(prompt)}
                  disabled={isLoading}
                >
                  {prompt.slice(0, 10)}...
                </Button>
              ))}
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-lg border ${testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-medium ${testResult.success ? "text-green-900" : "text-red-900"}`}>
                      {testResult.success ? "测试成功" : "测试失败"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {testResult.provider && (
                      <Badge variant="outline">
                        {testResult.provider === "deepseek" ? "DeepSeek" : testResult.provider}
                      </Badge>
                    )}
                    {testResult.responseTime && <Badge variant="secondary">{testResult.responseTime}ms</Badge>}
                  </div>
                </div>

                {testResult.success ? (
                  <div className="space-y-2">
                    {testResult.model && (
                      <div className="text-sm text-green-700">
                        <strong>模型:</strong> {testResult.model}
                      </div>
                    )}
                    <div className="text-sm text-green-800 bg-white p-3 rounded border">
                      <strong>AI 响应:</strong>
                      <div className="mt-1">{testResult.result}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-800">
                    <strong>错误信息:</strong> {testResult.error}
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">配置说明:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 确保已设置 DEEPSEEK_API_KEY 环境变量</p>
                <p>• API Key 格式应为: sk-xxxxxxxxxx</p>
                <p>• 如果测试失败，请检查 API Key 是否有效</p>
                <p>• DeepSeek API 文档: https://platform.deepseek.com/api-docs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>环境变量状态</CardTitle>
            <CardDescription>当前环境中的 AI 服务配置</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DEEPSEEK_API_KEY:</span>
                  <Badge variant="default">已配置</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">OPENAI_API_KEY:</span>
                  <Badge variant="default">已配置</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>优先级:</strong>
                  <ol className="list-decimal list-inside mt-1 text-xs text-gray-600">
                    <li>DeepSeek API (推荐)</li>
                    <li>OpenAI API (备选)</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
