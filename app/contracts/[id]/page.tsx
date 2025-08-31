"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  ArrowLeft,
  Download,
  Share,
  Edit,
  Loader2,
  Calendar,
  User,
  Hash,
  Clock
} from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/data-table"

interface Contract {
  id: string
  title: string
  content: string
  status: string
  type: string
  version: number
  createdAt: string
  updatedAt: string
  metadata?: any
}

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContract()
  }, [contractId])

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`)
      if (response.ok) {
        const data = await response.json()
        setContract(data)
      }
    } catch (error) {
      console.error("获取合同失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>加载合同中...</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">合同未找到</h3>
          <p className="text-gray-500 mb-4">抱歉，未找到您请求的合同</p>
          <Button onClick={() => router.push("/dashboard/contracts")}>
            返回合同列表
          </Button>
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
            <Link href="/dashboard/contracts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回合同列表
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{contract.title}</h1>
                <p className="text-sm text-gray-500">合同详情</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              分享
            </Button>
            <Button size="sm" onClick={() => router.push(`/contracts/${contractId}/preview`)}>
              <Edit className="h-4 w-4 mr-2" />
              AI分析
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：合同详情 (2/3) */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>合同内容</span>
                  </span>
                  <StatusBadge status={contract.status} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 min-h-[500px]">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {contract.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：合同信息 (1/3) */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>合同信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">合同标题</h3>
                  <p className="text-sm text-gray-900">{contract.title}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">合同类型</h3>
                  <p className="text-sm text-gray-900">{contract.type}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">合同状态</h3>
                  <StatusBadge status={contract.status} />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">合同版本</h3>
                  <p className="text-sm text-gray-900">v{contract.version}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">创建时间</h3>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(contract.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">最后更新</h3>
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(contract.updatedAt).toLocaleString()}
                  </div>
                </div>
                
                {contract.metadata && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">元数据</h3>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(contract.metadata, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>相关方</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">暂无相关方信息</p>
                  <p className="text-xs text-gray-400 mt-1">功能开发中</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}