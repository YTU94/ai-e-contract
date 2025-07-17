import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { FileText, Plus, TrendingUp, Users, Clock, CheckCircle, Brain, Upload } from "lucide-react"
=======
import { FileText, Plus, TrendingUp, Users, Clock, CheckCircle, Brain, BarChart3, Settings } from "lucide-react"
>>>>>>> 1c1addaa6e04cd8644cbf20f1877be1a72edda76
import { UserNav } from "@/components/user-nav"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar"
import Link from "next/link"

const sidebarItems = [
  {
    title: "数据总览",
    icon: BarChart3,
    href: "/dashboard",
    isActive: true
  },
  {
    title: "合同管理",
    icon: FileText,
    href: "/dashboard/contracts",
    subItems: [
      { title: "所有合同", href: "/dashboard/contracts" },
      { title: "待签署", href: "/dashboard/pending" },
      { title: "已完成", href: "/dashboard/completed" },
      { title: "合作伙伴", href: "/dashboard/partners" }
    ]
  },
  {
    title: "AI功能管理",
    icon: Brain,
    href: "/ai-tools",
    subItems: [
      { title: "AI助手", href: "/chat" },
      { title: "AI工具箱", href: "/ai-tools" }
    ]
  }
]

export default function DashboardPage() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/contracts/upload">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建合同
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来！</h1>
          <p className="text-gray-600">这里是您的合同管理仪表板，您可以查看和管理所有合同。</p>
        </div>

        {/* Stats Cards - 现在可以点击 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/contracts">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总合同数</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 较上月</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/pending">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待签署</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">需要您的签名</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/completed">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">已完成</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">+5 本月完成</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/partners">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">合作伙伴</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">活跃合作伙伴</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Contracts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>最近的合同</CardTitle>
              <CardDescription>您最近创建或修改的合同</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "软件开发服务合同", status: "待签署", date: "2024-01-15" },
                  { name: "保密协议", status: "已完成", date: "2024-01-12" },
                  { name: "采购合同", status: "审核中", date: "2024-01-10" },
                ].map((contract, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{contract.name}</p>
                      <p className="text-sm text-gray-500">{contract.date}</p>
=======
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-[20px]">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ContractAI</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-6">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  {item.subItems && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuButton key={subItem.href} asChild size="sm">
                          <Link href={subItem.href} className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md">
                            {subItem.title}
                          </Link>
                        </SidebarMenuButton>
                      ))}
>>>>>>> 1c1addaa6e04cd8644cbf20f1877be1a72edda76
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

<<<<<<< HEAD
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用的合同管理操作</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/chat">
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI 智能助手
                  </Button>
                </Link>
                <Link href="/contracts/upload">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    创建新合同
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  上传合同模板
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  查看分析报告
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  管理团队成员
                </Button>
                <Link href="/ai-tools">
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI 工具箱
                  </Button>
                </Link>
=======
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">数据总览</h1>
>>>>>>> 1c1addaa6e04cd8644cbf20f1877be1a72edda76
              </div>
              <div className="flex items-center space-x-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新建合同
                </Button>
                <UserNav />
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来！</h1>
              <p className="text-gray-600">这里是您的合同管理仪表板，您可以查看和管理所有合同。</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/dashboard/contracts">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总合同数</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 较上月</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/pending">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">待签署</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">需要您的签名</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/completed">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">已完成</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">+5 本月完成</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/partners">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">合作伙伴</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">活跃合作伙伴</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Contracts and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>最近的合同</CardTitle>
                  <CardDescription>您最近创建或修改的合同</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "软件开发服务合同", status: "待签署", date: "2024-01-15" },
                      { name: "保密协议", status: "已完成", date: "2024-01-12" },
                      { name: "采购合同", status: "审核中", date: "2024-01-10" },
                    ].map((contract, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contract.name}</p>
                          <p className="text-sm text-gray-500">{contract.date}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            contract.status === "已完成"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "待签署"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {contract.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>常用的合同管理操作</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/chat">
                      <Button className="w-full justify-start" variant="outline">
                        <Brain className="h-4 w-4 mr-2" />
                        AI 智能助手
                      </Button>
                    </Link>
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      创建新合同
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      上传合同模板
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      查看分析报告
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      管理团队成员
                    </Button>
                    <Link href="/ai-tools">
                      <Button className="w-full justify-start" variant="outline">
                        <Brain className="h-4 w-4 mr-2" />
                        AI 工具箱
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
