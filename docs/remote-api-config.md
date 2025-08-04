# 远程API配置指南

本文档介绍如何配置和使用远程API服务，支持在本地开发模式下调用远程HTTP接口服务。

## 功能特性

- ✅ 支持本地/远程API切换
- ✅ 完整的错误处理和超时控制
- ✅ 连接状态监控和测试
- ✅ 开发环境友好的配置管理
- ✅ 统一的API响应格式

## 环境变量配置

在 `.env.local` 文件中添加以下配置：

```bash
# 远程API配置 (开发模式)
USE_REMOTE_API="false"                                    # 是否启用远程API
REMOTE_API_BASE_URL="https://your-remote-api.example.com" # 远程API基础URL
REMOTE_API_KEY="your-remote-api-key-here"                 # 远程API密钥
REMOTE_API_TIMEOUT="30000"                                # 请求超时时间(毫秒)
```

### 配置说明

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `USE_REMOTE_API` | boolean | `false` | 是否启用远程API模式 |
| `REMOTE_API_BASE_URL` | string | - | 远程API服务的基础URL |
| `REMOTE_API_KEY` | string | - | 远程API的认证密钥 |
| `REMOTE_API_TIMEOUT` | number | `30000` | 请求超时时间(毫秒) |

## 使用方式

### 1. 启用远程API

```bash
# 在 .env.local 中设置
USE_REMOTE_API="true"
REMOTE_API_BASE_URL="https://api.example.com"
REMOTE_API_KEY="your-api-key"
```

### 2. 禁用远程API (使用本地服务)

```bash
# 在 .env.local 中设置
USE_REMOTE_API="false"
```

### 3. 代码中的自动切换

AI服务会自动根据配置选择使用本地或远程API：

```typescript
// 自动选择本地或远程API
const result = await AIContractService.analyzeContract(contractContent)

// 结果中包含来源信息
console.log(result.source) // "local" 或 "remote"
```

## API端点映射

本地API会自动映射到远程API的对应端点：

| 功能 | 本地方法 | 远程端点 |
|------|----------|----------|
| 合同分析 | `analyzeContract()` | `POST /api/contracts/analyze` |
| 合同生成 | `generateContract()` | `POST /api/contracts/generate` |
| 连接测试 | `testConnection()` | `POST /api/ai/test` |

## 远程API接口规范

### 请求格式

所有请求都使用JSON格式，包含以下通用结构：

```json
{
  "data": "具体的业务数据",
  "options": {
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
```

### 响应格式

所有响应都遵循统一格式：

```json
{
  "success": true,
  "data": {
    "result": "处理结果",
    "provider": "服务提供商",
    "model": "使用的模型"
  },
  "error": "错误信息(仅在失败时)"
}
```

### 认证方式

使用Bearer Token认证：

```
Authorization: Bearer your-api-key
```

## 状态监控

### 1. 通过API检查状态

```bash
GET /api/remote-api/status
```

### 2. 通过组件查看状态

在管理界面中使用 `RemoteAPIStatus` 组件：

```tsx
import { RemoteAPIStatus } from "@/components/remote-api-status"

export default function AdminPage() {
  return (
    <div>
      <RemoteAPIStatus />
    </div>
  )
}
```

## 错误处理

系统提供完整的错误处理机制：

### 常见错误类型

1. **配置错误**: 缺少必要的环境变量
2. **网络错误**: 无法连接到远程服务
3. **认证错误**: API密钥无效或过期
4. **超时错误**: 请求超过设定的超时时间
5. **服务错误**: 远程服务返回错误响应

### 错误处理策略

- 自动重试机制(可配置)
- 详细的错误日志记录
- 用户友好的错误提示
- 降级到本地服务(可选)

## 开发调试

### 1. 启用调试日志

```bash
DEBUG="remote-api:*" npm run dev
```

### 2. 测试连接

```bash
curl -X POST http://localhost:3000/api/remote-api/status \
  -H "Content-Type: application/json" \
  -d '{"action": "test"}'
```

### 3. 查看配置状态

```bash
curl http://localhost:3000/api/remote-api/status
```

## 最佳实践

### 1. 开发环境配置

- 在开发时使用远程API进行集成测试
- 保持本地API作为备用方案
- 定期测试远程API连接状态

### 2. 安全考虑

- 不要在代码中硬编码API密钥
- 使用环境变量管理敏感信息
- 定期轮换API密钥

### 3. 性能优化

- 合理设置超时时间
- 使用连接池管理HTTP连接
- 实现请求缓存机制

## 故障排除

### 1. 连接失败

检查网络连接和防火墙设置：

```bash
curl -I https://your-remote-api.example.com/health
```

### 2. 认证失败

验证API密钥是否正确：

```bash
curl -H "Authorization: Bearer your-api-key" \
  https://your-remote-api.example.com/api/auth/verify
```

### 3. 超时问题

调整超时设置：

```bash
REMOTE_API_TIMEOUT="60000"  # 增加到60秒
```

## 更新日志

- **v1.0.0**: 初始版本，支持基本的远程API调用
- **v1.1.0**: 添加连接状态监控和错误处理
- **v1.2.0**: 支持自动切换和降级机制
