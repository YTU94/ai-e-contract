"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, ExternalLink, Rocket } from "lucide-react"

interface DeploymentInfo {
  timestamp: string
  environment: string
  vercelUrl?: string
  nextauthUrl?: string
  hasDirectUrl: boolean
  hasDatabaseUrl: boolean
  hasNextauthSecret: boolean
  hasOpenaiKey: boolean
}

interface DeploymentStatus {
  success: boolean
  deployment: DeploymentInfo
  message: string
}

export function DeploymentStatus() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkDeploymentStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/deploy-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check deployment status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkDeploymentStatus()
  }, [])

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>部署状态检查</CardTitle>
          <CardDescription>正在检查部署状态...</CardDescription>
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
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span>部署状态</span>
            </CardTitle>
            <CardDescription>
              环境: {status.deployment.environment} | 检查时间: {new Date(status.deployment.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkDeploymentStatus} disabled={isLoading}>
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            刷新状态
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.success ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">🎉 {status.message}！应用已准备就绪。</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* 环境变量状态 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">数据库配置</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">DATABASE_URL</span>
              {status.deployment.hasDatabaseUrl ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  已配置
                </Badge>
              ) : (
                <Badge variant="destructive">未配置</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">DIRECT_URL</span>
              {status.deployment.hasDirectUrl ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  已配置
                </Badge>
              ) : (
                <Badge variant="destructive">未配置</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">认证配置</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">NEXTAUTH_SECRET</span>
              {status.deployment.hasNextauthSecret ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  已配置
                </Badge>
              ) : (
                <Badge variant="destructive">未配置</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">NEXTAUTH_URL</span>
              {status.deployment.nextauthUrl ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  已配置
                </Badge>
              ) : (
                <Badge variant="destructive">未配置</Badge>
              )}
            </div>
          </div>
        </div>

        {/* URL 信息 */}
        {status.deployment.nextauthUrl && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">应用访问地址</h4>
            <div className="flex items-center justify-between">
              <code className="text-sm bg-white px-2 py-1 rounded border">{status.deployment.nextauthUrl}</code>
              <a
                href={status.deployment.nextauthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                访问应用
              </a>
            </div>
          </div>
        )}

        {/* AI 服务状态 */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="font-medium">AI 服务 (OpenAI)</span>
          </div>
          {status.deployment.hasOpenaiKey ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              已配置
            </Badge>
          ) : (
            <Badge variant="destructive">未配置</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
