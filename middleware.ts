import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // 开发模式下允许所有路由访问
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next()
    }
    
    // 生产模式下的逻辑保持不变
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 开发模式下直接允许访问，跳过所有认证
        if (process.env.NODE_ENV === "development") {
          return true
        }
        
        // 检查用户是否有权限访问受保护的路由
        const { pathname } = req.nextUrl

        // 公开路由
        if (
          pathname.startsWith("/auth") ||
          pathname === "/" ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon")
        ) {
          return true
        }

        // 受保护的路由需要登录
        return !!token
      },
    },
  },
)

// 开发模式下禁用中间件
export const config = {
  matcher: process.env.NODE_ENV === "development" 
    ? [] 
    : ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
}
