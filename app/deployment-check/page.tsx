import { DeploymentStatus } from "@/components/deployment-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Settings, TestTube } from "lucide-react"
import Link from "next/link"

export default function DeploymentCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/env-check">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                环境变量检查
              </Button>
            </Link>
            <Link href="/setup">
              <Button variant="outline" size="sm">
                <TestTube className="h-4 w-4 mr-2" />
                系统设置
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">部署状态检查</h1>
            <p className="text-gray-600">验证 Vercel 部署状态和环境变量配置</p>
          </div>

          <DeploymentStatus />

          {/* 功能测试指南 */}
          <Card>
            <CardHeader>
              <CardTitle>功能测试清单</CardTitle>
              <CardDescription>验证应用的各项功能是否正常工作</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">🔐 认证功能</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 用户注册功能</li>
                    <li>• 用户登录功能</li>
                    <li>• 会话管理</li>
                    <li>• 密码安全性</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">🗄️ 数据库功能</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 数据库连接</li>
                    <li>• 数据读写操作</li>
                    <li>• 数据迁移</li>
                    <li>• 数据完整性</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">🤖 AI 功能</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 合同分析</li>
                    <li>• 合同生成</li>
                    <li>• AI 聊天助手</li>
                    <li>• API 响应速度</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">📄 合同管理</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 合同创建</li>
                    <li>• 合同编辑</li>
                    <li>• 电子签名</li>
                    <li>• 状态跟踪</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速测试链接 */}
          <Card>
            <CardHeader>
              <CardTitle>快速测试</CardTitle>
              <CardDescription>点击以下链接快速测试各项功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    用户注册
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    用户登录
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    AI 聊天
                  </Button>
                </Link>
                <Link href="/ai-tools">
                  <Button variant="outline" className="w-full">
                    AI 工具
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 故障排除 */}
          <Card>
            <CardHeader>
              <CardTitle>故障排除</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600">❌ 如果认证功能不工作</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    检查 NEXTAUTH_SECRET 和 NEXTAUTH_URL 是否正确配置，确保 URL 匹配实际域名
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-yellow-600">⚠️ 如果数据库连接失败</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    验证 DATABASE_URL 和 DIRECT_URL 格式，检查 Vercel Postgres 服务状态
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-blue-600">ℹ️ 如果 AI 功能异常</h4>
                  <p className="text-sm text-gray-600 mt-1">确认 OPENAI_API_KEY 有效，检查 API 配额和网络连接</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
