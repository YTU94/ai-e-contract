// Mock database for v0 preview environment
interface MockUser {
  id: string
  name: string | null
  email: string
  password: string
  company: string | null
  role: "USER" | "ADMIN" | "MANAGER"
  createdAt: Date
  updatedAt: Date
}

interface MockContract {
  id: string
  title: string
  content: string
  status: "DRAFT" | "PENDING" | "REVIEW" | "SIGNED" | "COMPLETED" | "CANCELLED" | "EXPIRED"
  type: string
  version: number
  templateId: string | null
  metadata: any
  createdAt: Date
  updatedAt: Date
  userId: string
}

interface MockContractTemplate {
  id: string
  name: string
  description: string | null
  content: string
  category: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockSignature {
  id: string
  contractId: string
  signerName: string
  signerEmail: string
  signedAt: Date
  signature: string
  ipAddress: string | null
  userAgent: string | null
}

interface MockAuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string | null
  details: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

class MockDatabase {
  private users: MockUser[] = []
  private contracts: MockContract[] = []
  private contractTemplates: MockContractTemplate[] = []
  private signatures: MockSignature[] = []
  private auditLogs: MockAuditLog[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // 创建示例用户
    this.users = [
      {
        id: "user_1",
        name: "张三",
        email: "demo@example.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password
        company: "示例科技有限公司",
        role: "USER",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "user_2",
        name: "李四",
        email: "admin@example.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password
        company: "管理员",
        role: "ADMIN",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ]

    // 创建合同模板
    this.contractTemplates = [
      {
        id: "template_1",
        name: "软件开发服务合同",
        description: "标准软件开发服务合同模板",
        category: "技术服务",
        content: `# 软件开发服务合同

## 甲方（委托方）
公司名称：[甲方公司名称]
地址：[甲方地址]
联系人：[联系人姓名]
电话：[联系电话]

## 乙方（开发方）
公司名称：[乙方公司名称]
地址：[乙方地址]
联系人：[联系人姓名]
电话：[联系电话]

## 项目概述
项目名称：[项目名称]
开发周期：[开发周期]
项目预算：[项目预算]

## 服务内容
1. 需求分析和系统设计
2. 软件开发和编码
3. 系统测试和调试
4. 部署和上线支持
5. 维护和技术支持

## 交付成果
1. 完整的软件系统
2. 源代码和技术文档
3. 用户操作手册
4. 系统部署文档

## 付款方式
1. 签约时支付30%
2. 开发完成支付60%
3. 验收通过支付10%

## 知识产权
[知识产权条款]

## 保密条款
[保密条款内容]

## 违约责任
[违约责任条款]

## 争议解决
[争议解决条款]`,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "template_2",
        name: "保密协议",
        description: "标准保密协议模板",
        category: "法律文件",
        content: `# 保密协议

## 甲方
公司名称：[甲方公司名称]
地址：[甲方地址]

## 乙方
公司名称：[乙方公司名称]
地址：[乙方地址]

## 保密信息定义
本协议所称保密信息包括但不限于：
1. 技术信息
2. 商业信息
3. 财务信息
4. 客户信息
5. 其他标记为保密的信息

## 保密义务
1. 严格保密
2. 限制使用
3. 妥善保管
4. 及时归还

## 保密期限
保密期限为[保密期限]年

## 违约责任
[违约责任条款]

## 其他条款
[其他相关条款]`,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ]

    // 创建示例合同
    this.contracts = [
      {
        id: "contract_1",
        title: "网站开发服务合同",
        content: "这是一份网站开发服务合同的详细内容...",
        status: "PENDING",
        type: "软件开发服务合同",
        version: 1,
        templateId: "template_1",
        metadata: { totalValue: 50000, currency: "CNY" },
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        userId: "user_1",
      },
      {
        id: "contract_2",
        title: "技术保密协议",
        content: "这是一份技术保密协议的详细内容...",
        status: "COMPLETED",
        type: "保密协议",
        version: 1,
        templateId: "template_2",
        metadata: { department: "技术部" },
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-20"),
        userId: "user_1",
      },
      {
        id: "contract_3",
        title: "APP开发项目合同",
        content: "这是一份APP开发项目合同的详细内容...",
        status: "SIGNED",
        type: "软件开发服务合同",
        version: 2,
        templateId: "template_1",
        metadata: { totalValue: 80000, currency: "CNY" },
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-25"),
        userId: "user_1",
      },
    ]

    // 创建签名记录
    this.signatures = [
      {
        id: "signature_1",
        contractId: "contract_2",
        signerName: "张三",
        signerEmail: "demo@example.com",
        signedAt: new Date("2024-01-20"),
        signature: "digital_signature_data_1",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0...",
      },
      {
        id: "signature_2",
        contractId: "contract_3",
        signerName: "李四",
        signerEmail: "partner@example.com",
        signedAt: new Date("2024-01-25"),
        signature: "digital_signature_data_2",
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0...",
      },
    ]
  }

  // User operations
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findUserById(id: string): Promise<MockUser | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async createUser(data: Omit<MockUser, "id" | "createdAt" | "updatedAt">): Promise<MockUser> {
    const user: MockUser = {
      ...data,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async countUsers(): Promise<number> {
    return this.users.length
  }

  // Contract operations
  async findContractsByUserId(
    userId: string,
    options?: {
      status?: string
      type?: string
      search?: string
      skip?: number
      take?: number
    },
  ): Promise<MockContract[]> {
    let contracts = this.contracts.filter((contract) => contract.userId === userId)

    if (options?.status) {
      contracts = contracts.filter((contract) => contract.status === options.status)
    }

    if (options?.type) {
      contracts = contracts.filter((contract) => contract.type.toLowerCase().includes(options.type!.toLowerCase()))
    }

    if (options?.search) {
      contracts = contracts.filter(
        (contract) =>
          contract.title.toLowerCase().includes(options.search!.toLowerCase()) ||
          contract.type.toLowerCase().includes(options.search!.toLowerCase()),
      )
    }

    // Sort by updatedAt desc
    contracts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    if (options?.skip || options?.take) {
      const skip = options.skip || 0
      const take = options.take || contracts.length
      contracts = contracts.slice(skip, skip + take)
    }

    return contracts
  }

  async findContractById(id: string): Promise<MockContract | null> {
    return this.contracts.find((contract) => contract.id === id) || null
  }

  async createContract(data: Omit<MockContract, "id" | "createdAt" | "updatedAt">): Promise<MockContract> {
    const contract: MockContract = {
      ...data,
      id: `contract_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.contracts.push(contract)
    return contract
  }

  async updateContract(id: string, data: Partial<MockContract>): Promise<MockContract | null> {
    const index = this.contracts.findIndex((contract) => contract.id === id)
    if (index === -1) return null

    this.contracts[index] = {
      ...this.contracts[index],
      ...data,
      updatedAt: new Date(),
    }
    return this.contracts[index]
  }

  async countContracts(userId: string, status?: string): Promise<number> {
    let contracts = this.contracts.filter((contract) => contract.userId === userId)
    if (status) {
      contracts = contracts.filter((contract) => contract.status === status)
    }
    return contracts.length
  }

  // Contract Template operations
  async findActiveTemplates(): Promise<MockContractTemplate[]> {
    return this.contractTemplates.filter((template) => template.isActive)
  }

  async createTemplate(
    data: Omit<MockContractTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<MockContractTemplate> {
    const template: MockContractTemplate = {
      ...data,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.contractTemplates.push(template)
    return template
  }

  // Signature operations
  async findSignaturesByContractId(contractId: string): Promise<MockSignature[]> {
    return this.signatures.filter((signature) => signature.contractId === contractId)
  }

  async createSignature(data: Omit<MockSignature, "id" | "signedAt">): Promise<MockSignature> {
    const signature: MockSignature = {
      ...data,
      id: `signature_${Date.now()}`,
      signedAt: new Date(),
    }
    this.signatures.push(signature)
    return signature
  }

  // Audit Log operations
  async createAuditLog(data: Omit<MockAuditLog, "id" | "createdAt">): Promise<MockAuditLog> {
    const auditLog: MockAuditLog = {
      ...data,
      id: `audit_${Date.now()}`,
      createdAt: new Date(),
    }
    this.auditLogs.push(auditLog)
    return auditLog
  }

  // Statistics for partners (from signatures)
  async getPartnerStats(userId: string): Promise<any[]> {
    const userContracts = this.contracts.filter((contract) => contract.userId === userId)
    const contractIds = userContracts.map((contract) => contract.id)
    const signatures = this.signatures.filter((signature) => contractIds.includes(signature.contractId))

    const partnersMap = new Map()

    signatures.forEach((signature) => {
      const email = signature.signerEmail
      if (!partnersMap.has(email)) {
        partnersMap.set(email, {
          id: email,
          name: signature.signerName,
          company: signature.signerName.split(" ")[0] + " 公司",
          email: email,
          phone: undefined,
          contractsCount: 0,
          totalValue: 0,
          lastContractDate: signature.signedAt,
          status: "active" as const,
        })
      }

      const partner = partnersMap.get(email)
      partner.contractsCount += 1

      const contract = userContracts.find((c) => c.id === signature.contractId)
      if (contract?.metadata?.totalValue) {
        partner.totalValue += contract.metadata.totalValue
      }

      if (new Date(signature.signedAt) > new Date(partner.lastContractDate)) {
        partner.lastContractDate = signature.signedAt
      }

      const daysSinceLastContract = Math.floor(
        (new Date().getTime() - new Date(signature.signedAt).getTime()) / (1000 * 60 * 60 * 24),
      )
      partner.status = daysSinceLastContract <= 30 ? "active" : "inactive"
    })

    return Array.from(partnersMap.values()).sort((a, b) => b.contractsCount - a.contractsCount)
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    return true
  }
}

// Singleton instance
let mockDb: MockDatabase | null = null

export function getMockDatabase(): MockDatabase {
  if (!mockDb) {
    mockDb = new MockDatabase()
  }
  return mockDb
}

// Check if we should use mock database
export function shouldUseMockDatabase(): boolean {
  // Use mock database in v0 preview or when DATABASE_URL is not available
  return !process.env.DATABASE_URL || process.env.NODE_ENV === "development"
}
