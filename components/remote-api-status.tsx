"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  Zap,
  Clock,
  Settings
} from "lucide-react"

interface RemoteAPIStatus {
  enabled: boolean
  configured: boolean
  baseURL: string
  timeout: number
  environment: string
}

interface ConnectionTest {
  success: boolean
  data?: any
  error?: string
}

interface StatusResponse {
  success: boolean
  status: RemoteAPIStatus
  connectionTest: ConnectionTest | null
  timestamp: string
}

export function RemoteAPIStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/remote-api/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch remote API status:", error)
      setStatus({
        success: false,
        status: {
          enabled: false,
          configured: false,
          baseURL: "Error",
          timeout: 0,
          environment: "unknown",
        },
        connectionTest: null,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setTesting(true)
      const response = await fetch("/api/remote-api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      })
      const data = await response.json()
      
      if (data.success) {
        // 重新获取状态以更新连接测试结果
        await fetchStatus()
      }
    } catch (error) {
      console.error("Failed to test connection:", error)
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            远程API状态
          </CardTitle>
          <CardDescription>检查远程接口服务配置和连接状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">加载中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            远程API状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            无法获取远程API状态
          </div>
        </CardContent>
      </Card>
    )
  }

  const { status: apiStatus, connectionTest } = status

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          远程API状态
          <Badge variant={apiStatus.enabled ? "default" : "secondary"}>
            {apiStatus.enabled ? "已启用" : "已禁用"}
          </Badge>
        </CardTitle>
        <CardDescription>
          开发模式远程接口服务配置和连接状态
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本配置信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">配置状态</span>
            </div>
            <div className="flex items-center gap-2">
              {apiStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {apiStatus.configured ? "已配置" : "未配置"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">环境</span>
            </div>
            <Badge variant="outline">{apiStatus.environment}</Badge>
          </div>
        </div>

        <Separator />

        {/* 详细配置 */}
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">基础URL:</span>
            <p className="text-sm text-muted-foreground font-mono">
              {apiStatus.baseURL}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">超时: {apiStatus.timeout}ms</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* 连接测试 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">连接测试</span>
            <Button
              size="sm"
              variant="outline"
              onClick={testConnection}
              disabled={!apiStatus.enabled || !apiStatus.configured || testing}
            >
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  测试连接
                </>
              )}
            </Button>
          </div>

          {connectionTest && (
            <div className="flex items-center gap-2">
              {connectionTest.success ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">连接成功</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    连接失败: {connectionTest.error}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* 刷新按钮 */}
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新状态
          </Button>
        </div>

        {/* 最后更新时间 */}
        <div className="text-xs text-muted-foreground text-center">
          最后更新: {new Date(status.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
