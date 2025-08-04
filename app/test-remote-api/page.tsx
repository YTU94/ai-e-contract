"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  TestTube, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Globe,
  Cpu
} from "lucide-react"

interface TestResult {
  success: boolean
  result?: string
  analysis?: string
  contract?: string
  provider?: string
  model?: string
  source?: string
  error?: string
}

export default function TestRemoteAPIPage() {
  const [testPrompt, setTestPrompt] = useState("请用一句话介绍人工智能在合同管理中的应用。")
  const [contractContent, setContractContent] = useState(`甲方：ABC科技有限公司
乙方：XYZ服务公司

本合同约定甲方委托乙方提供软件开发服务，项目周期为3个月，总金额为50万元人民币。`)
  
  const [testResults, setTestResults] = useState<{
    connection?: TestResult
    analysis?: TestResult
    generation?: TestResult
  }>({})
  
  const [loading, setLoading] = useState<{
    connection?: boolean
    analysis?: boolean
    generation?: boolean
  }>({})

  const testConnection = async () => {
    setLoading(prev => ({ ...prev, connection: true }))
    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: testPrompt }),
      })
      const result = await response.json()
      setTestResults(prev => ({ ...prev, connection: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        connection: { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        } 
      }))
    } finally {
      setLoading(prev => ({ ...prev, connection: false }))
    }
  }

  const testAnalysis = async () => {
    setLoading(prev => ({ ...prev, analysis: true }))
    try {
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractCode: contractContent }),
      })
      const result = await response.json()
      setTestResults(prev => ({ ...prev, analysis: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        analysis: { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        } 
      }))
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }))
    }
  }

  const testGeneration = async () => {
    setLoading(prev => ({ ...prev, generation: true }))
    try {
      const response = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contractType: "软件开发合同",
          requirements: "开发一个电商网站，包含用户管理、商品管理、订单管理等功能"
        }),
      })
      const result = await response.json()
      setTestResults(prev => ({ ...prev, generation: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        generation: { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        } 
      }))
    } finally {
      setLoading(prev => ({ ...prev, generation: false }))
    }
  }

  const renderTestResult = (result: TestResult | undefined, title: string) => {
    if (!result) return null

    return (
      <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        <div className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium">{title}</span>
          {result.source && (
            <Badge variant={result.source === "remote" ? "default" : "secondary"}>
              {result.source === "remote" ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  远程
                </>
              ) : (
                <>
                  <Cpu className="h-3 w-3 mr-1" />
                  本地
                </>
              )}
            </Badge>
          )}
        </div>
        <AlertDescription className="mt-2">
          {result.success ? (
            <div className="space-y-2">
              {result.provider && result.model && (
                <p className="text-sm text-muted-foreground">
                  提供商: {result.provider} | 模型: {result.model}
                </p>
              )}
              {result.result && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm">{result.result}</p>
                </div>
              )}
              {result.analysis && (
                <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{result.analysis}</pre>
                </div>
              )}
              {result.contract && (
                <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{result.contract}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600">{result.error}</p>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">远程API测试</h1>
        <p className="text-muted-foreground">
          测试本地和远程AI服务的连接和功能
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 连接测试 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              连接测试
            </CardTitle>
            <CardDescription>
              测试AI服务的基本连接和响应
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">测试提示词</label>
              <Textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="输入测试提示词..."
                rows={3}
              />
            </div>
            <Button 
              onClick={testConnection} 
              disabled={loading.connection}
              className="w-full"
            >
              {loading.connection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  测试连接
                </>
              )}
            </Button>
            {renderTestResult(testResults.connection, "连接测试结果")}
          </CardContent>
        </Card>

        {/* 合同分析测试 */}
        <Card>
          <CardHeader>
            <CardTitle>合同分析测试</CardTitle>
            <CardDescription>
              测试合同内容分析功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">合同内容</label>
              <Textarea
                value={contractContent}
                onChange={(e) => setContractContent(e.target.value)}
                placeholder="输入合同内容..."
                rows={4}
              />
            </div>
            <Button 
              onClick={testAnalysis} 
              disabled={loading.analysis}
              className="w-full"
            >
              {loading.analysis ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  分析合同
                </>
              )}
            </Button>
            {renderTestResult(testResults.analysis, "合同分析结果")}
          </CardContent>
        </Card>
      </div>

      {/* 合同生成测试 */}
      <Card>
        <CardHeader>
          <CardTitle>合同生成测试</CardTitle>
          <CardDescription>
            测试合同自动生成功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testGeneration} 
            disabled={loading.generation}
            className="w-full"
          >
            {loading.generation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                生成软件开发合同
              </>
            )}
          </Button>
          {renderTestResult(testResults.generation, "合同生成结果")}
        </CardContent>
      </Card>
    </div>
  )
}
