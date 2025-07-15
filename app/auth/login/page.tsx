"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [dbStatus, setDbStatus] = useState<any>(null)
  const router = useRouter()

  // 检查数据库状态
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch("/api/system-info")
        const info = await response.json()
        setDbStatus(info)
        console.log("系统信息:", info)
      } catch (error) {
        console.error("获取系统信息失败:", error)
      }
    }
    
    checkDatabase()
  }, [])

  // Update the handleSubmit function to use NextAuth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 开发模式下检查数据库连接状态
      if (process.env.NODE_ENV === "development") {
        try {
          const dbResponse = await fetch("/api/database/setup")
          const dbStatus = await dbResponse.json()
          console.log("数据库状态:", dbStatus)
          
          if (!dbStatus.success) {
            setError(`数据库连接失败: ${dbStatus.error || "未知错误"}`)
            return
          }
        } catch (dbError) {
          console.error("数据库检查失败:", dbError)
          setError("无法连接到数据库服务")
          return
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push("/dashboard") // 登录成功后跳转到仪表板
      }
    } catch (err) {
      setError("登录失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">登录账户</CardTitle>
            <CardDescription className="text-center">输入您的邮箱和密码来登录</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  忘记密码？
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                登录
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              还没有账户？{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                立即注册
              </Link>
            </div>

            {/* Demo提示 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>演示账户：</strong>
                <br />
                邮箱: demo@example.com
                <br />
                密码: password
              </p>
            </div>

            {/* 数据库状态 */}
            {dbStatus && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>数据库状态：</strong>
                  <span className={dbStatus.database?.connected ? "text-green-600" : "text-red-600"}>
                    {dbStatus.database?.connected ? "已连接" : "未连接"}
                  </span>
                  ({dbStatus.database?.type})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
