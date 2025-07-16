"use client"

import { useSession } from "next-auth/react"
import { getDevSession } from "./dev-session"

export function useDevSession() {
  const session = useSession()
  
  // 开发模式下返回模拟会话
  if (process.env.NODE_ENV === "development") {
    return {
      data: getDevSession(),
      status: "authenticated" as const,
    }
  }
  
  return session
}
