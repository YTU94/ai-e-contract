"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DatabasePage() {
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/setup")
      const data = await response.json()
      setDbInfo(data)
    } catch (error) {
      console.error("数据库检查失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">数据库管理</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>数据库状态</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={checkDatabase} disabled={loading}>
            {loading ? "检查中..." : "刷新状态"}
          </Button>
          
          {dbInfo && (
            <div className="mt-4 space-y-2">
              <p>连接状态: {dbInfo.success ? "✅ 已连接" : "❌ 连接失败"}</p>
              <p>数据库类型: {dbInfo.dbType}</p>
              <p>用户数量: {dbInfo.userCount}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}