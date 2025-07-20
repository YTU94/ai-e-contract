"use client"

import { Button } from "@/components/ui/button"
import { FileText, Plus, Brain, BarChart3 } from "lucide-react"
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
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "数据总览",
    icon: BarChart3,
    href: "/dashboard",
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "数据总览"
    if (pathname === "/dashboard/contracts") return "合同管理"
    if (pathname === "/dashboard/pending") return "待签署合同"
    if (pathname === "/dashboard/completed") return "已完成合同"
    if (pathname === "/dashboard/partners") return "合作伙伴"
    return "仪表板"
  }

  return (
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
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.subItems && item.subItems.some(subItem => pathname === subItem.href))
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    
                    {item.subItems && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuButton key={subItem.href} asChild size="sm">
                            <Link 
                              href={subItem.href} 
                              className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                                pathname === subItem.href 
                                  ? 'text-blue-600 bg-blue-50' 
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/contracts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新建合同
                  </Button>
                </Link>
                <UserNav />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
