"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Brain } from "lucide-react"

export function ContractAnalyzer() {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("请输入合同内容")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalysis("")

    try {
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "分析失败")
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败，请稍后重试")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI 合同分析</span>
          </CardTitle>
          <CardDescription>上传或粘贴合同内容，AI 将为您分析关键条款和潜在风险</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="请粘贴合同内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="min-h-[200px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !content.trim()} className="w-full">
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAnalyzing ? "分析中..." : "开始分析"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>分析结果</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ContractAnalyzer
