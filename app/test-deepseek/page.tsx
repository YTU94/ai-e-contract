import { AIContractService } from "@/lib/ai-service"

async function getContractData() {
  const contractService = new AIContractService()
  const data = await contractService.getContractData()
  return data
}

export default async function Page() {
  const data = await getContractData()

  return (
    <div>
      <h1>AI Contract Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
