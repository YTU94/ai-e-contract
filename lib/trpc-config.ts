// tRPC 配置示例
// 在实际项目中需要设置完整的 tRPC 路由和类型

import { z } from "zod"

// Zod 验证模式
export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少需要8个字符"),
  company: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
})

export const contractSchema = z.object({
  title: z.string().min(1, "合同标题不能为空"),
  content: z.string().min(1, "合同内容不能为空"),
  type: z.string().min(1, "请选择合同类型"),
})

// tRPC 路由示例
export const trpcRouterExample = `
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc'
import { registerSchema, loginSchema, contractSchema } from './schemas'
import { hash } from 'bcryptjs'

export const appRouter = router({
  auth: router({
    register: publicProcedure
      .input(registerSchema)
      .mutation(async ({ input, ctx }) => {
        const { name, email, password, company } = input
        
        // 检查用户是否已存在
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email }
        })
        
        if (existingUser) {
          throw new Error('用户已存在')
        }
        
        // 加密密码
        const hashedPassword = await hash(password, 12)
        
        // 创建用户
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            company,
          }
        })
        
        return { success: true, userId: user.id }
      }),
      
    login: publicProcedure
      .input(loginSchema)
      .mutation(async ({ input, ctx }) => {
        // 登录逻辑
        // 这里通常会与 NextAuth.js 集成
      }),
  }),
  
  contracts: router({
    create: protectedProcedure
      .input(contractSchema)
      .mutation(async ({ input, ctx }) => {
        const contract = await ctx.prisma.contract.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
          }
        })
        
        return contract
      }),
      
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        return await ctx.prisma.contract.findMany({
          where: { userId: ctx.session.user.id },
          orderBy: { createdAt: 'desc' }
        })
      }),
  }),
})

export type AppRouter = typeof appRouter
`

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ContractInput = z.infer<typeof contractSchema>
