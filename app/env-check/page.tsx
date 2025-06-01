import { EnvChecker } from "@/components/env-checker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Settings } from "lucide-react"
import Link from "next/link"

export default function EnvCheckPage() {
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
            <Link href="/setup">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                系统设置
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">环境变量验证</h1>
            <p className="text-gray-600">检查 Vercel 项目中的环境变量配置状态</p>
          </div>

          <EnvChecker />

          {/* 配置指南 */}
          <Card>
            <CardHeader>
              <CardTitle>Vercel 环境变量配置指南</CardTitle>
              <CardDescription>如何在 Vercel 中正确配置环境变量</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">通过 Dashboard 配置</h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>登录 Vercel Dashboard</li>
                    <li>选择您的项目</li>
                    <li>进入 Settings → Environment Variables</li>
                    <li>添加每个必需的环境变量</li>
                    <li>选择适当的环境 (Production/Preview/Development)</li>
                    <li>保存并重新部署</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium mb-2">通过 CLI 配置</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <code className="block bg-gray-100 p-2 rounded text-xs">
                      npm i -g vercel
                      <br />
                      vercel login
                      <br />
                      vercel env add DATABASE_URL production
                      <br />
                      vercel env add NEXTAUTH_SECRET production
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t">
                <a
                  href="https://vercel.com/docs/projects/environment-variables"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Vercel 环境变量文档
                </a>
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Vercel Dashboard
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 常见问题 */}
          <Card>
            <CardHeader>
              <CardTitle>常见问题解决</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600">❌ DATABASE_URL 连接失败</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    检查 Vercel Postgres 连接字符串格式，确保包含正确的用户名、密码和主机地址
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-yellow-600">⚠️ NEXTAUTH_SECRET 太短</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    使用至少32字符的随机字符串，可以使用 <code>openssl rand -base64 32</code> 生成
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-blue-600">ℹ️ OPENAI_API_KEY 无效</h4>
                  <p className="text-sm text-gray-600 mt-1">确保 API 密钥以 "sk-" 开头，并且账户有足够的配额</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
