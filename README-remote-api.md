# 远程API配置功能

本项目现已支持在开发模式下调用远程HTTP接口服务，提供灵活的本地/远程API切换能力。

## 🚀 功能特性

- ✅ **智能切换**: 支持本地和远程AI服务自动切换
- ✅ **完整配置**: 通过环境变量轻松配置远程API
- ✅ **状态监控**: 实时监控远程API连接状态
- ✅ **错误处理**: 完善的错误处理和超时控制
- ✅ **开发友好**: 提供测试页面和管理界面
- ✅ **统一接口**: 保持与本地API相同的调用方式

## 📋 快速开始

### 1. 环境配置

在 `.env.local` 文件中添加以下配置：

```bash
# 启用远程API
USE_REMOTE_API="true"

# 远程API配置
REMOTE_API_BASE_URL="https://your-remote-api.example.com"
REMOTE_API_KEY="your-api-key-here"
REMOTE_API_TIMEOUT="30000"

# AI服务配置 (作为备用)
OPENAI_API_KEY="sk-your-openai-api-key"
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
```

### 2. 启动项目

```bash
npm run dev
```

### 3. 测试功能

访问以下页面测试远程API功能：

- **测试页面**: http://localhost:3000/test-remote-api
- **管理页面**: http://localhost:3000/admin/remote-api
- **状态检查**: http://localhost:3000/api/remote-api/status

## 🔧 配置说明

### 环境变量

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `USE_REMOTE_API` | boolean | `false` | 是否启用远程API模式 |
| `REMOTE_API_BASE_URL` | string | - | 远程API服务的基础URL |
| `REMOTE_API_KEY` | string | - | 远程API的认证密钥 |
| `REMOTE_API_TIMEOUT` | number | `30000` | 请求超时时间(毫秒) |

### 切换模式

#### 使用远程API
```bash
USE_REMOTE_API="true"
```

#### 使用本地AI服务
```bash
USE_REMOTE_API="false"
```

## 🛠️ API端点映射

| 功能 | 本地方法 | 远程端点 |
|------|----------|----------|
| 合同分析 | `AIContractService.analyzeContract()` | `POST /api/contracts/analyze` |
| 合同生成 | `AIContractService.generateContract()` | `POST /api/contracts/generate` |
| 连接测试 | `AIContractService.testConnection()` | `POST /api/ai/test` |

## 📊 状态监控

### 通过API检查状态

```bash
# 获取状态
curl http://localhost:3000/api/remote-api/status

# 测试连接
curl -X POST http://localhost:3000/api/remote-api/status \
  -H "Content-Type: application/json" \
  -d '{"action": "test"}'
```

### 通过界面监控

访问管理页面查看详细状态：
http://localhost:3000/admin/remote-api

## 🔍 使用示例

### 代码中的使用

```typescript
import { AIContractService } from "@/lib/ai-service"

// 自动选择本地或远程API
const result = await AIContractService.analyzeContract(contractContent)

// 检查结果来源
console.log(result.source) // "local" 或 "remote"
```

### 响应格式

```json
{
  "success": true,
  "analysis": "分析结果...",
  "provider": "deepseek",
  "model": "deepseek-chat",
  "source": "remote"
}
```

## 🚨 故障排除

### 常见问题

1. **连接失败**
   - 检查 `REMOTE_API_BASE_URL` 是否正确
   - 确认网络连接正常
   - 验证防火墙设置

2. **认证失败**
   - 检查 `REMOTE_API_KEY` 是否有效
   - 确认API密钥权限

3. **超时问题**
   - 增加 `REMOTE_API_TIMEOUT` 值
   - 检查远程服务响应时间

### 调试方法

1. **查看日志**
   ```bash
   # 启动时查看控制台输出
   npm run dev
   ```

2. **测试连接**
   ```bash
   curl -I https://your-remote-api.example.com/health
   ```

3. **验证配置**
   访问: http://localhost:3000/api/system-info

## 📁 文件结构

```
lib/
├── remote-api-config.ts    # 远程API配置和客户端
├── ai-service.ts          # 增强的AI服务(支持远程)
└── env.ts                 # 环境变量验证

app/
├── api/remote-api/        # 远程API状态接口
├── admin/remote-api/      # 管理页面
└── test-remote-api/       # 测试页面

components/
└── remote-api-status.tsx  # 状态监控组件

docs/
└── remote-api-config.md   # 详细配置文档
```

## 🔐 安全考虑

1. **API密钥管理**
   - 不要在代码中硬编码密钥
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥

2. **网络安全**
   - 使用HTTPS协议
   - 验证SSL证书
   - 配置适当的超时时间

3. **访问控制**
   - 限制API访问来源
   - 实施速率限制
   - 监控异常请求

## 📈 性能优化

1. **连接管理**
   - 使用连接池
   - 实现请求重试机制
   - 配置合理的超时时间

2. **缓存策略**
   - 缓存频繁请求的结果
   - 实现智能缓存失效
   - 减少不必要的API调用

3. **监控指标**
   - 响应时间监控
   - 错误率统计
   - 可用性检查

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 支持

如有问题或建议，请：

1. 查看文档: `docs/remote-api-config.md`
2. 检查测试页面: `/test-remote-api`
3. 查看管理界面: `/admin/remote-api`
4. 提交 Issue 或 PR

---

**注意**: 这是一个开发功能，建议在生产环境中谨慎使用，并确保远程API服务的稳定性和安全性。
