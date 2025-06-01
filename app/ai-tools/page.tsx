import { ContractAnalyzer } from "@/components/contract-analyzer"
import { ContractGenerator } from "@/components/contract-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Brain, Wand2 } from "lucide-react"

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContractAI</span>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              仪表板
            </a>
            <a href="/ai-tools" className="text-blue-600 font-medium">
              AI 工具
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 智能工具</h1>
            <p className="text-gray-600">使用人工智能技术分析和生成合同内容</p>
          </div>

          <Tabs defaultValue="analyzer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyzer" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>合同分析</span>
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>合同生成</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer">
              <ContractAnalyzer />
            </TabsContent>

            <TabsContent value="generator">
              <ContractGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
