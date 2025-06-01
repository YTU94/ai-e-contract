import { DatabaseStatus } from "@/components/database-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Database, Key, Zap } from "lucide-react"
import { AIStatusChecker } from "@/components/ai-status-checker"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">系统设置</h1>
            <p className="text-gray-600">配置和检查系统组件状态</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Status */}
            <DatabaseStatus />

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>环境变量</span>
                </CardTitle>
                <CardDescription>系统环境变量配置状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">DATABASE_URL</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {process.env.DATABASE_URL ? "已配置" : "未配置"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">NEXTAUTH_SECRET</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {process.env.NEXTAUTH_SECRET ? "已配置" : "未配置"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API_KEY</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {process.env.API_KEY ? "已配置" : "未配置"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">OPENAI_API_KEY</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {process.env.OPENAI_API_KEY ? "已配置" : "未配置"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* AI Status */}
            <AIStatusChecker />

            {/* AI Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>AI 服务</span>
                </CardTitle>
                <CardDescription>AI 功能配置状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• 合同智能分析</p>
                  <p>• 自动合同生成</p>
                  <p>• 风险点识别</p>
                  <p>• 条款建议</p>
                </div>
                <div className="text-xs text-gray-500">需要配置 OPENAI_API_KEY 环境变量来启用 AI 功能</div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>系统信息</span>
                </CardTitle>
                <CardDescription>当前系统配置信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Node.js 版本:</span>
                    <span className="text-gray-600">{process.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>环境:</span>
                    <span className="text-gray-600">{process.env.NODE_ENV}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>数据库类型:</span>
                    <span className="text-gray-600">PostgreSQL (Vercel)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>认证方式:</span>
                    <span className="text-gray-600">NextAuth.js</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
