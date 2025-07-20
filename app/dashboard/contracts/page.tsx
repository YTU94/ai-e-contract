"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, StatusBadge, ActionsMenu } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface Contract {
  id: string
  title: string
  type: string
  status: string
  version: number
  createdAt: string
  updatedAt: string
}

const columns: ColumnDef<Contract>[] = [
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
    accessorKey: "version",
    header: "版本",
    cell: ({ row }) => <div className="text-sm">v{row.getValue("version")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          创建时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
        <ActionsMenu
          onView={() => console.log("查看", contract.id)}
          onEdit={() => console.log("编辑", contract.id)}
          onDelete={() => console.log("删除", contract.id)}
        />
      )
    },
  },
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/dashboard/contracts")
      const data = await response.json()
      setContracts(data.contracts || [])
    } catch (error) {
      console.error("获取合同列表失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (contract: Contract) => {
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
            <CardTitle>所有合同</CardTitle>
            <CardDescription>管理您的所有电子合同，包括草稿、待签署、已完成等状态</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={contracts}
              searchKey="title"
              searchPlaceholder="搜索合同标题..."
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
  )
}
