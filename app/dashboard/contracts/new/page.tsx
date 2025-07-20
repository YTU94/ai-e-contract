"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  FileText, 
  Plus, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContractTemplate {
  id: string
  name: string
  description: string
  category: string
  content: string
}

const contractTemplates: ContractTemplate[] = [
  {
    id: "1",
    name: "销售合同模板",
    description: "适用于商品销售的标准合同模板",
    category: "销售",
    content: "销售合同模板内容..."
  },
  {
    id: "2", 
    name: "服务协议模板",
    description: "适用于服务提供的标准协议模板",
    category: "服务",
    content: "服务协议模板内容..."
  },
  {
    id: "3",
    name: "租赁合同模板", 
    description: "适用于房屋或设备租赁的合同模板",
    category: "租赁",
    content: "租赁合同模板内容..."
  },
  {
    id: "4",
    name: "劳动合同模板",
    description: "适用于员工雇佣的劳动合同模板", 
    category: "人事",
    content: "劳动合同模板内容..."
  }
]

export default function NewContractPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [activeTab, setActiveTab] = useState("upload")
  const [isLoading, setIsLoading] = useState(false)
  
  // 上传相关状态
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [contractTitle, setContractTitle] = useState("")
  const [contractDescription, setContractDescription] = useState("")
  
  // 模板相关状态
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [templateTitle, setTemplateTitle] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      if (!contractTitle) {
        setContractTitle(file.name.replace('.pdf', ''))
      }
    } else {
      toast({
        title: "文件格式错误",
        description: "请上传PDF格式的文件",
        variant: "destructive"
      })
    }
  }

  const handleUploadSubmit = async () => {
    if (!uploadedFile || !contractTitle.trim()) {
      toast({
        title: "信息不完整",
        description: "请上传文件并填写合同标题",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // 创建FormData上传文件
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('title', contractTitle)
      formData.append('description', contractDescription)
      formData.append('type', 'uploaded')

      const response = await fetch('/api/contracts/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const result = await response.json()
      
      toast({
        title: "合同创建成功",
        description: "正在跳转到预览页面...",
      })

      // 跳转到预览页面
      router.push(`/contracts/${result.contractId}/preview`)
      
    } catch (error) {
      console.error('上传失败:', error)
      toast({
        title: "创建失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSubmit = async () => {
    if (!selectedTemplate || !templateTitle.trim()) {
      toast({
        title: "信息不完整", 
        description: "请选择模板并填写合同标题",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: templateTitle,
          description: templateDescription,
          templateId: selectedTemplate.id,
          content: selectedTemplate.content,
          type: 'template'
        })
      })

      if (!response.ok) {
        throw new Error('创建失败')
      }

      const result = await response.json()
      
      toast({
        title: "合同创建成功",
        description: "正在跳转到预览页面...",
      })

      // 跳转到预览页面
      router.push(`/contracts/${result.contractId}/preview`)
      
    } catch (error) {
      console.error('创建失败:', error)
      toast({
        title: "创建失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新建合同</h1>
          <p className="text-gray-600">选择上传PDF文件或从模板创建新合同</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>上传PDF</span>
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>从模板创建</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>上传PDF合同</CardTitle>
                <CardDescription>
                  上传现有的PDF合同文件，系统将自动解析并提供AI分析功能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 文件上传区域 */}
                <div>
                  <Label htmlFor="file-upload">合同文件</Label>
                  <div 
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadedFile ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">
                          点击上传PDF文件
                        </p>
                        <p className="text-sm text-gray-500">
                          支持PDF格式，最大50MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* 合同信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract-title">合同标题 *</Label>
                    <Input
                      id="contract-title"
                      value={contractTitle}
                      onChange={(e) => setContractTitle(e.target.value)}
                      placeholder="请输入合同标题"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contract-type">合同类型</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="选择合同类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">销售合同</SelectItem>
                        <SelectItem value="service">服务协议</SelectItem>
                        <SelectItem value="lease">租赁合同</SelectItem>
                        <SelectItem value="employment">劳动合同</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contract-description">合同描述</Label>
                  <Textarea
                    id="contract-description"
                    value={contractDescription}
                    onChange={(e) => setContractDescription(e.target.value)}
                    placeholder="请输入合同描述（可选）"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleUploadSubmit}
                    disabled={!uploadedFile || !contractTitle.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      <>
                        创建合同
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template" className="mt-6">
            <div className="space-y-6">
              {/* 模板选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>选择合同模板</CardTitle>
                  <CardDescription>
                    从预设模板快速创建合同，可根据需要进行修改
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contractTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 合同信息 */}
              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle>合同信息</CardTitle>
                    <CardDescription>
                      填写基于模板创建的合同基本信息
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="template-title">合同标题 *</Label>
                        <Input
                          id="template-title"
                          value={templateTitle}
                          onChange={(e) => setTemplateTitle(e.target.value)}
                          placeholder="请输入合同标题"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>基于模板</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border">
                          <span className="text-sm font-medium">
                            {selectedTemplate.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="template-description">合同描述</Label>
                      <Textarea
                        id="template-description"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="请输入合同描述（可选）"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                      >
                        取消
                      </Button>
                      <Button 
                        onClick={handleTemplateSubmit}
                        disabled={!templateTitle.trim() || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            创建中...
                          </>
                        ) : (
                          <>
                            创建合同
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
