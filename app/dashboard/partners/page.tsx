"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Users, ArrowLeft, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, ActionsMenu } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface Partner {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  contractsCount: number
  totalValue: number
  lastContractDate: string
  status: "active" | "inactive"
}

const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          合作伙伴
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-gray-600">{row.original.company}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "联系方式",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <Mail className="h-3 w-3 mr-1" />
          {row.getValue("email")}
        </div>
        {row.original.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-3 w-3 mr-1" />
            {row.original.phone}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "contractsCount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          合同数量
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("contractsCount")} 份</div>,
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          合作金额
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("totalValue") as number
      return <div className="text-sm font-medium">¥{value.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "lastContractDate",
    header: "最近合作",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastContractDate"))
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>{status === "active" ? "活跃" : "非活跃"}</Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const partner = row.original
      return (
        <ActionsMenu onView={() => console.log("查看", partner.id)} onEdit={() => console.log("编辑", partner.id)} />
      )
    },
  },
]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/dashboard/partners")
      const data = await response.json()
      setPartners(data.partners || [])
    } catch (error) {
      console.error("获取合作伙伴失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (partner: Partner) => {
    router.push(`/partners/${partner.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回仪表板
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">合作伙伴</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              添加合作伙伴
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>合作伙伴管理</CardTitle>
            <CardDescription>管理您的合作伙伴信息，查看合作历史和统计数据</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={partners}
              searchKey="name"
              searchPlaceholder="搜索合作伙伴..."
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
