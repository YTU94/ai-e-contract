"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, EyeOff } from "lucide-react"

interface EnvVariable {
  configured: boolean
  valid?: boolean
  masked?: string
  value?: string
}

interface EnvStatus {
  success: boolean
  environment: string
  variables: Record<string, EnvVariable>
  summary: {
    total: number
    configured: number
    valid: number
  }
}

export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showValues, setShowValues] = useState(false)

  const checkEnvironment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/env-check")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Failed to check environment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const getStatusIcon = (variable: EnvVariable) => {
    if (!variable.configured) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    if (variable.valid === false) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusBadge = (variable: EnvVariable) => {
    if (!variable.configured) {
      return <Badge variant="destructive">未配置</Badge>
    }
    if (variable.valid === false) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          格式错误
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        已配置
      </Badge>
    )
  }

  if (!envStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>环境变量检查</CardTitle>
          <CardDescription>正在检查环境变量配置...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>环境变量配置检查</CardTitle>
            <CardDescription>
              当前环境: {envStatus.environment} | 已配置: {envStatus.summary.configured}/{envStatus.summary.total} |
              有效: {envStatus.summary.valid}/{envStatus.summary.total}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowValues(!showValues)}>
              {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showValues ? "隐藏" : "显示"}值
            </Button>
            <Button variant="outline" size="sm" onClick={checkEnvironment} disabled={isLoading}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              刷新
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!envStatus.success && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>环境变量配置不完整或无效，请检查以下问题并重新部署</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {Object.entries(envStatus.variables).map(([name, variable]) => (
            <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(variable)}
                <div>
                  <div className="font-medium">{name}</div>
                  {showValues && (
                    <div className="text-sm text-gray-600 font-mono">
                      {variable.value || variable.masked || "Not set"}
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(variable)}
            </div>
          ))}
        </div>

        {/* 配置指南 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">配置指南</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              • <strong>DATABASE_URL</strong>: Vercel Postgres 连接字符串
            </p>
            <p>
              • <strong>NEXTAUTH_SECRET</strong>: 至少32字符的随机字符串
            </p>
            <p>
              • <strong>NEXTAUTH_URL</strong>: 您的应用完整URL
            </p>
            <p>
              • <strong>OPENAI_API_KEY</strong>: OpenAI API密钥 (sk-开头)
            </p>
          </div>
        </div>

        {/* 快速修复建议 */}
        {!envStatus.success && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">快速修复</h4>
            <div className="text-sm text-yellow-800 space-y-2">
              {Object.entries(envStatus.variables)
                .filter(([, variable]) => !variable.configured || variable.valid === false)
                .map(([name, variable]) => (
                  <div key={name}>
                    <strong>{name}</strong>:{" "}
                    {!variable.configured ? "需要在 Vercel 项目设置中添加此环境变量" : "检查变量格式是否正确"}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
