import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Shield, Zap, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">智能电子合同管理平台</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          基于AI技术的电子合同管理系统，让合同签署、管理和分析变得更加智能和高效
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/auth/register">
            <Button size="lg" className="px-8 py-3">
              免费开始使用
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="px-8 py-3">
              立即登录
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心功能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>智能合同生成</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>基于AI技术自动生成标准化合同模板，提高工作效率</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>安全电子签名</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>符合法律法规的电子签名技术，确保合同的法律效力</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>智能分析</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>AI驱动的合同条款分析，识别风险点和关键信息</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>协作管理</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>多人协作审批流程，实时跟踪合同状态和进度</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">ContractAI</span>
          </div>
          <p className="text-gray-400">© 2024 ContractAI. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  )
}
