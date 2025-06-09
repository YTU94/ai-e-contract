"use client"

import { useState } from "react"
import { AIContractService } from "@/lib/ai-service"

const ContractGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [contract, setContract] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateContract = async () => {
    setIsLoading(true)
    try {
      const generatedContract = await AIContractService.generateContract(prompt)
      setContract(generatedContract)
    } catch (error) {
      console.error("Error generating contract:", error)
      setContract("Error generating contract. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>Contract Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter contract details..."
        rows={5}
        cols={50}
      />
      <button onClick={generateContract} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Contract"}
      </button>
      {contract && (
        <div>
          <h2>Generated Contract:</h2>
          <pre>{contract}</pre>
        </div>
      )}
    </div>
  )
}

export default ContractGenerator
