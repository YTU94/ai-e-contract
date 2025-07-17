// 开发模式下的模拟会话
export const DEV_SESSION = {
  user: {
    id: "user_1",
    name: "张三",
    email: "demo@example.com",
    company: "示例科技有限公司",
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
}

export function getDevSession() {
  if (process.env.NODE_ENV === "development") {
    return DEV_SESSION
  }
  return null
}
