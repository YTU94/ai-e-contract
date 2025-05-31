// Environment variables validation and configuration
import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid database URL"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL").optional(),

  // AI Services (if you plan to add AI features)
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required").optional(),

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
