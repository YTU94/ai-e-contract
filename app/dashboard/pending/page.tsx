"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Clock, ArrowLeft, FileSignature } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, StatusBadge, ActionsMenu } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface PendingContract {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  daysWaiting: number
}

const columns: ColumnDef<PendingContract>[] = [
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
    accessorKey: "daysWaiting",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          等待天数
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const days = row.getValue("daysWaiting") as number
      return (
        <div
          className={`text-sm font-medium ${days > 7 ? "text-red-600" : days > 3 ? "text-yellow-600" : "text-green-600"}`}
        >
          {days} 天
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
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
            <FileSignature className="h-4 w-4 mr-1" />
            签署
          </Button>
          <ActionsMenu
            onView={() => console.log("查看", contract.id)}
            onEdit={() => console.log("编辑", contract.id)}
          />
        </div>
      )
    },
  },
]

export default function PendingContractsPage() {
  const [contracts, setContracts] = useState<PendingContract[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPendingContracts()
  }, [])

  const fetchPendingContracts = async () => {
    try {
      const response = await fetch("/api/dashboard/pending")
      const data = await response.json()
      setContracts(data.contracts || [])
    } catch (error) {
      console.error("获取待签署合同失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (contract: PendingContract) => {
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
    <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>待签署合同</CardTitle>
            <CardDescription>需要您签署的合同列表，请及时处理避免延误</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={contracts}
              searchKey="title"
              searchPlaceholder="搜索待签署合同..."
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
  )
}
