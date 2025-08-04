// Remote API configuration for development mode
import { envConfig } from "./env"

export interface RemoteAPIConfig {
  enabled: boolean
  baseURL: string
  apiKey: string
  timeout: number
  headers: Record<string, string>
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 获取远程API配置
export function getRemoteAPIConfig(): RemoteAPIConfig | null {
  if (!envConfig.USE_REMOTE_API) {
    return null
  }

  if (!envConfig.REMOTE_API_BASE_URL || !envConfig.REMOTE_API_KEY) {
    console.warn("Remote API is enabled but missing required configuration")
    return null
  }

  return {
    enabled: true,
    baseURL: envConfig.REMOTE_API_BASE_URL,
    apiKey: envConfig.REMOTE_API_KEY,
    timeout: envConfig.REMOTE_API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${envConfig.REMOTE_API_KEY}`,
      "X-API-Source": "ai-e-contract-dev",
    },
  }
}

// 远程API客户端类
export class RemoteAPIClient {
  private config: RemoteAPIConfig | null

  constructor() {
    this.config = getRemoteAPIConfig()
  }

  // 检查是否启用远程API
  isEnabled(): boolean {
    return !!this.config?.enabled
  }

  // 获取配置信息
  getConfig(): RemoteAPIConfig | null {
    return this.config
  }

  // 通用请求方法
  async request<T = any>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
      body?: any
      headers?: Record<string, string>
      timeout?: number
    } = {}
  ): Promise<APIResponse<T>> {
    if (!this.config) {
      return {
        success: false,
        error: "Remote API is not configured or disabled",
      }
    }

    const {
      method = "GET",
      body,
      headers = {},
      timeout = this.config.timeout,
    } = options

    const url = `${this.config.baseURL}${endpoint}`
    const requestHeaders = {
      ...this.config.headers,
      ...headers,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("Remote API request failed:", error)
      
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: `Request timeout after ${timeout}ms`,
          }
        }
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: "Unknown error occurred",
      }
    }
  }

  // GET 请求
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", headers })
  }

  // POST 请求
  async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, headers })
  }

  // PUT 请求
  async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, headers })
  }

  // DELETE 请求
  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", headers })
  }

  // 健康检查
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string }>> {
    return this.get("/health")
  }

  // 测试连接
  async testConnection(): Promise<APIResponse<any>> {
    try {
      const result = await this.healthCheck()
      if (result.success) {
        return {
          success: true,
          data: {
            status: "connected",
            baseURL: this.config?.baseURL,
            timestamp: new Date().toISOString(),
          },
        }
      }
      return result
    } catch (error) {
      return {
        success: false,
        error: "Failed to connect to remote API",
      }
    }
  }
}

// 单例实例
export const remoteAPIClient = new RemoteAPIClient()

// 工具函数：检查是否应该使用远程API
export function shouldUseRemoteAPI(): boolean {
  return envConfig.USE_REMOTE_API && !!getRemoteAPIConfig()
}

// 工具函数：获取API状态信息
export function getAPIStatus() {
  const config = getRemoteAPIConfig()
  return {
    enabled: envConfig.USE_REMOTE_API,
    configured: !!config,
    baseURL: config?.baseURL || "Not configured",
    timeout: config?.timeout || 0,
    environment: envConfig.NODE_ENV,
  }
}
