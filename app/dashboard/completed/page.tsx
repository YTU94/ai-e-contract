"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, StatusBadge, ActionsMenu } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface CompletedContract {
  id: string
  title: string
  type: string
  status: string
  completedAt: string
  signaturesCount: number
  totalValue?: number
}

const columns: ColumnDef<CompletedContract>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          合同标题
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: "合同类型",
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "signaturesCount",
    header: "签名数量",
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("signaturesCount")} 个签名</div>,
  },
  {
    accessorKey: "totalValue",
    header: "合同金额",
    cell: ({ row }) => {
      const value = row.getValue("totalValue") as number
      return value ? (
        <div className="text-sm font-medium">¥{value.toLocaleString()}</div>
      ) : (
        <div className="text-sm text-gray-400">-</div>
      )
    },
  },
  {
    accessorKey: "completedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          完成时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("completedAt"))
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const contract = row.original
      return (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            下载
          </Button>
          <ActionsMenu onView={() => console.log("查看", contract.id)} />
        </div>
      )
    },
  },
]

export default function CompletedContractsPage() {
  const [contracts, setContracts] = useState<CompletedContract[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCompletedContracts()
  }, [])

  const fetchCompletedContracts = async () => {
    try {
      const response = await fetch("/api/dashboard/completed")
      const data = await response.json()
      setContracts(data.contracts || [])
    } catch (error) {
      console.error("获取已完成合同失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (contract: CompletedContract) => {
    router.push(`/contracts/${contract.id}`)
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
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">已完成合同</span>
            </div>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>已完成合同</CardTitle>
            <CardDescription>已签署完成的合同列表，可以下载和查看详情</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={contracts}
              searchKey="title"
              searchPlaceholder="搜索已完成合同..."
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
