"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AIContractService } from "@/lib/ai-service"

interface AIStatusCheckerProps {
  contractAddress: string
}

const AIStatusChecker: React.FC<AIStatusCheckerProps> = ({ contractAddress }) => {
  const [aiStatus, setAiStatus] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAIStatus = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const status = await AIContractService.getAIStatus(contractAddress)
        setAiStatus(status)
      } catch (e: any) {
        setError(e.message || "Failed to fetch AI status.")
        setAiStatus(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAIStatus()
  }, [contractAddress])

  if (isLoading) {
    return <div>Loading AI Status...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>AI Status: {aiStatus === null ? "Unknown" : aiStatus ? "Active" : "Inactive"}</div>
}

export default AIStatusChecker
