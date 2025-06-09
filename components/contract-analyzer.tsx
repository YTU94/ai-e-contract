"use client"

import type React from "react"
import { useState } from "react"
import { AIContractService } from "@/lib/ai-service"

interface ContractAnalyzerProps {
  contractCode: string
}

const ContractAnalyzer: React.FC<ContractAnalyzerProps> = ({ contractCode }) => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeContract = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await AIContractService.analyzeContract(contractCode)
      setAnalysisResult(result)
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.")
      setAnalysisResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button onClick={analyzeContract} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze Contract"}
      </button>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {analysisResult && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{analysisResult}</pre>
        </div>
      )}
    </div>
  )
}

export default ContractAnalyzer
