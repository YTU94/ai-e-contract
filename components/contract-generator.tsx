"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wand2, FileText, Download } from "lucide-react"

const contractTypes = [
  { value: "software-development", label: "软件开发服务合同" },
  { value: "nda", label: "保密协议" },
  { value: "purchase", label: "采购合同" },
  { value: "employment", label: "劳动合同" },
  { value: "consulting", label: "咨询服务合同" },
  { value: "partnership", label: "合作协议" },
]

export function ContractGenerator() {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    requirements: "",
  })
  const [generatedContract, setGeneratedContract] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!formData.type || !formData.requirements) {
      setError("请选择合同类型并填写需求描述")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedContract("")

    try {
      const selectedType = contractTypes.find((t) => t.value === formData.type)
      const response = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType?.label || formData.type,
          requirements: formData.requirements,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "生成失败")
      }

      setGeneratedContract(data.contract)
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedContract], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.title || "合同"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>AI 合同生成器</span>
          </CardTitle>
          <CardDescription>基于 AI 技术自动生成专业合同模板</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract-type">合同类型</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择合同类型" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract-title">合同标题（可选）</Label>
              <Input
                id="contract-title"
                placeholder="输入合同标题"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">需求描述</Label>
            <Textarea
              id="requirements"
              placeholder="请详细描述合同的具体需求，包括：&#10;- 合同双方信息&#10;- 服务内容或商品详情&#10;- 价格和付款方式&#10;- 时间安排&#10;- 特殊条款要求&#10;- 其他重要信息"
              value={formData.requirements}
              onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
              rows={6}
              className="min-h-[120px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.type || !formData.requirements}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "生成中..." : "生成合同"}
          </Button>
        </CardContent>
      </Card>

      {generatedContract && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle>生成的合同</CardTitle>
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                下载
              </Button>
            </div>
            <CardDescription>AI 生成的合同内容，请仔细审核后使用</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{generatedContract}</pre>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>重要提示：</strong>
                此合同由 AI 生成，仅供参考。请务必由专业法律人士审核后再正式使用。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
