import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "认证 - ContractAI",
  description: "登录或注册您的账户",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}
