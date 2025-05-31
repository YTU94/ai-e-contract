// NextAuth.js 配置文件示例
// 在实际项目中，这应该是 pages/api/auth/[...nextauth].ts (Pages Router)
// 或 app/api/auth/[...nextauth]/route.ts (App Router)

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 查找用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // 验证密码
        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          company: user.company,
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          company: token.company,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          company: u.company,
        }
      }
      return token
    },
  },
}

// 模拟 Prisma 实例
// const prisma = {
//   user: {
//     findUnique: async ({ where }: any) => {
//       // 模拟数据库查询
//       return null
//     }
//   }
// }
