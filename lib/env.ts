// Environment variables validation and configuration
import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid database URL"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL").optional(),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),

  // Remote API Configuration
  USE_REMOTE_API: z.string().transform(val => val === "true").default("false"),
  REMOTE_API_BASE_URL: z.string().url("Invalid remote API base URL").optional(),
  REMOTE_API_KEY: z.string().optional(),
  REMOTE_API_TIMEOUT: z.string().transform(val => parseInt(val) || 30000).default("30000"),

  // Email (if you plan to add email notifications)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // App Configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Validate environment variables
const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error("❌ Invalid environment variables:")
  console.error(env.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

export const envConfig = env.data

// Type-safe environment variables
export type EnvConfig = z.infer<typeof envSchema>

export function checkEnvStatus() {
  const hasAI = !!(envConfig.OPENAI_API_KEY || envConfig.DEEPSEEK_API_KEY)
  const hasRemoteAPI = envConfig.USE_REMOTE_API ? !!(envConfig.REMOTE_API_BASE_URL && envConfig.REMOTE_API_KEY) : true

  return {
    database: !!envConfig.DATABASE_URL,
    auth: !!envConfig.NEXTAUTH_SECRET,
    ai: hasAI,
    remoteAPI: hasRemoteAPI,
    useRemoteAPI: envConfig.USE_REMOTE_API,
    allConfigured: !!(envConfig.DATABASE_URL && envConfig.NEXTAUTH_SECRET && hasAI && hasRemoteAPI),
  }
}
