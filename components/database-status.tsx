"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import { db } from "@/lib/database"

interface DatabaseStatus {
  success: boolean
  userCount?: number
  error?: any
  dbType?: string
  message?: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSetupLoading, setIsSetupLoading] = useState(false)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const isConnected = await db.testConnection()
      const userCount = await db.countUsers()
      const dbType = db.getDatabaseType()

      setStatus({
        success: isConnected,
        userCount,
        dbType,
        message: isConnected ? `${dbType === "mock" ? "Mock" : "Postgres"} 数据库连接正常` : "数据库连接失败",
      })
    } catch (error) {
      setStatus({
        success: false,
        error: "连接失败",
        dbType: db.getDatabaseType(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setupDatabase = async () => {
    setIsSetupLoading(true)
    try {
      const dbType = db.getDatabaseType()

      if (dbType === "mock") {
        // Mock database is always ready
        setStatus({
          success: true,
          userCount: await db.countUsers(),
          dbType: "mock",
          message: "Mock 数据库已准备就绪",
        })
      } else {
        // For real database, call the setup API
        const response = await fetch("/api/database/setup", {
          method: "POST",
        })
        const data = await response.json()

        if (data.success) {
          await checkStatus()
        } else {
          setStatus(data)
        }
      }
    } catch (error) {
      setStatus({ success: false, error: "设置失败" })
    } finally {
      setIsSetupLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>数据库状态</span>
        </CardTitle>
        <CardDescription>Vercel Postgres 数据库连接状态</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="flex items-center space-x-2">
            {status.success ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {status.dbType === "mock" ? "Mock 数据库" : "Postgres 数据库"}
                </Badge>
                {status.userCount !== undefined && (
                  <span className="text-sm text-gray-600">用户数: {status.userCount}</span>
                )}
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <Badge variant="destructive">连接失败</Badge>
              </>
            )}
          </div>
        )}

        {status && !status.success && (
          <Alert variant="destructive">
            <AlertDescription>数据库连接失败: {status.error?.message || "未知错误"}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button onClick={checkStatus} disabled={isLoading} variant="outline" size="sm">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className="mr-2 h-4 w-4" />
            检查状态
          </Button>

          <Button onClick={setupDatabase} disabled={isSetupLoading} size="sm">
            {isSetupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            初始化数据库
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>• 使用 Vercel Postgres 作为数据库服务</p>
          <p>• 支持连接池和自动扩展</p>
          <p>• 内置备份和恢复功能</p>
        </div>
      </CardContent>
    </Card>
  )
}
