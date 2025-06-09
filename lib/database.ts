// Unified database interface for both real and mock databases
import { getMockDatabase, shouldUseMockDatabase } from "./mock-database"
import { prisma } from "./prisma"

export class DatabaseService {
  private static instance: DatabaseService
  private useMock: boolean

  private constructor() {
    this.useMock = shouldUseMockDatabase()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // User operations
  async findUserByEmail(email: string) {
    if (this.useMock) {
      return getMockDatabase().findUserByEmail(email)
    }
    return prisma.user.findUnique({ where: { email } })
  }

  async findUserById(id: string) {
    if (this.useMock) {
      return getMockDatabase().findUserById(id)
    }
    return prisma.user.findUnique({ where: { id } })
  }

  async createUser(data: any) {
    if (this.useMock) {
      return getMockDatabase().createUser(data)
    }
    return prisma.user.create({ data })
  }

  async countUsers() {
    if (this.useMock) {
      return getMockDatabase().countUsers()
    }
    return prisma.user.count()
  }

  // Contract operations
  async findContractsByUserId(userId: string, options?: any) {
    if (this.useMock) {
      return getMockDatabase().findContractsByUserId(userId, options)
    }

    const whereClause: any = { userId }

    if (options?.status) {
      whereClause.status = options.status
    }

    if (options?.search) {
      whereClause.OR = [
        { title: { contains: options.search, mode: "insensitive" } },
        { type: { contains: options.search, mode: "insensitive" } },
      ]
    }

    if (options?.type) {
      whereClause.type = { contains: options.type, mode: "insensitive" }
    }

    return prisma.contract.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    })
  }

  async findContractById(id: string) {
    if (this.useMock) {
      return getMockDatabase().findContractById(id)
    }
    return prisma.contract.findUnique({ where: { id } })
  }

  async createContract(data: any) {
    if (this.useMock) {
      return getMockDatabase().createContract(data)
    }
    return prisma.contract.create({ data })
  }

  async updateContract(id: string, data: any) {
    if (this.useMock) {
      return getMockDatabase().updateContract(id, data)
    }
    return prisma.contract.update({ where: { id }, data })
  }

  async countContracts(userId: string, status?: string) {
    if (this.useMock) {
      return getMockDatabase().countContracts(userId, status)
    }

    const whereClause: any = { userId }
    if (status) {
      whereClause.status = status
    }

    return prisma.contract.count({ where: whereClause })
  }

  // Contract Template operations
  async findActiveTemplates() {
    if (this.useMock) {
      return getMockDatabase().findActiveTemplates()
    }
    return prisma.contractTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
  }

  async createTemplate(data: any) {
    if (this.useMock) {
      return getMockDatabase().createTemplate(data)
    }
    return prisma.contractTemplate.create({ data })
  }

  // Signature operations
  async findSignaturesByContractId(contractId: string) {
    if (this.useMock) {
      return getMockDatabase().findSignaturesByContractId(contractId)
    }
    return prisma.signature.findMany({ where: { contractId } })
  }

  async createSignature(data: any) {
    if (this.useMock) {
      return getMockDatabase().createSignature(data)
    }
    return prisma.signature.create({ data })
  }

  // Audit Log operations
  async createAuditLog(data: any) {
    if (this.useMock) {
      return getMockDatabase().createAuditLog(data)
    }
    return prisma.auditLog.create({ data })
  }

  // Partner statistics
  async getPartnerStats(userId: string) {
    if (this.useMock) {
      return getMockDatabase().getPartnerStats(userId)
    }

    const signatures = await prisma.signature.findMany({
      where: {
        contract: {
          userId: userId,
        },
      },
      select: {
        signerName: true,
        signerEmail: true,
        signedAt: true,
        contract: {
          select: {
            id: true,
            status: true,
            metadata: true,
          },
        },
      },
    })

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

      if (signature.contract.metadata?.totalValue) {
        partner.totalValue += signature.contract.metadata.totalValue
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
  async testConnection() {
    if (this.useMock) {
      return getMockDatabase().testConnection()
    }

    try {
      await prisma.$connect()
      return true
    } catch (error) {
      return false
    } finally {
      await prisma.$disconnect()
    }
  }

  // Get database type
  getDatabaseType(): "mock" | "postgres" {
    return this.useMock ? "mock" : "postgres"
  }
}

export const db = DatabaseService.getInstance()
