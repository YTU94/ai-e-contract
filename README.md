# AI 电子合同管理系统

基于 Next.js 14 和 AI 技术的智能电子合同管理平台，支持合同生成、分析、签署和管理的全流程数字化解决方案。

## ✨ 主要功能

- 🤖 **AI 智能分析** - 基于 OpenAI GPT-4 的合同条款分析和风险识别
- 📝 **智能合同生成** - AI 驱动的合同模板生成和自定义
- ✍️ **电子签名** - 安全可靠的数字签名功能
- 👥 **用户管理** - 完整的用户注册、登录和权限管理
- 📊 **数据分析** - 合同状态统计和业务分析
- 🔒 **安全审计** - 完整的操作日志和审计追踪
- 🛠 **AI 工具集** - 实时AI服务状态监控和测试
- 📋 **合同模板库** - 预置和自定义合同模板管理

## 🛠 技术栈

- **前端框架**: Next.js 14 (App Router)
- **认证系统**: NextAuth.js / Auth.js
- **数据库**: Vercel Postgres + Prisma ORM
- **AI 服务**: OpenAI GPT-4 (通过 AI SDK)
- **UI 组件**: shadcn/ui + Tailwind CSS
- **表单验证**: Zod
- **类型安全**: TypeScript
- **部署平台**: Vercel

## 📋 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn 包管理器
- Git

## 🚀 快速开始

### Preview 模式（v0 环境）

在 v0 preview 环境中，系统会自动使用内存 Mock 数据库，无需配置外部数据库：

- ✅ 自动使用示例数据
- ✅ 所有功能正常工作
- ✅ 无需环境变量配置
- ⚠️ 数据不会持久化

**Demo 账户（Preview 模式）：**
- 邮箱: demo@example.com
- 密码: password

### 生产环境部署

对于生产环境，请按照以下步骤配置：

### 1. 克隆项目

\`\`\`bash
git clone <repository-url>
cd ai-contract-management
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
# 或
yarn install
\`\`\`

### 3. 环境变量配置

复制环境变量模板文件：

\`\`\`bash
cp .env.example .env.local
\`\`\`

编辑 \`.env.local\` 文件，配置以下环境变量：

\`\`\`env
# Vercel Postgres 数据库
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgres://username:password@host:port/database?sslmode=require"

# NextAuth.js 认证
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API (可选，用于 AI 功能)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# 应用环境
NODE_ENV="development"
\`\`\`

### 4. 数据库设置

#### 4.1 创建 Vercel Postgres 数据库

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入项目设置 → Storage → Create Database
3. 选择 Postgres 并创建数据库
4. 复制连接字符串到环境变量

#### 4.2 生成 Prisma 客户端

\`\`\`bash
npx prisma generate
\`\`\`

#### 4.3 推送数据库架构

\`\`\`bash
npx prisma db push
\`\`\`

#### 4.4 初始化数据库数据

\`\`\`bash
npm run db:seed
\`\`\`

### 5. 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 6. 验证 AI 功能

启动开发服务器后，访问以下页面验证AI功能：

\`\`\`bash
# 检查系统状态（包括AI服务）
http://localhost:3000/setup

# 使用AI工具
http://localhost:3000/ai-tools
\`\`\`

在系统设置页面，您可以：
- 检查 OpenAI API 连接状态
- 测试 AI 服务响应
- 查看所有环境变量配置状态

## 🎯 AI 功能使用指南

### 合同智能分析
1. 访问 `/ai-tools` 页面
2. 选择"合同分析"标签
3. 粘贴或输入合同内容
4. 点击"开始分析"获取详细报告

分析报告包括：
- 📋 合同基本信息识别
- 🔍 关键条款提取
- ⚠️ 风险点识别
- 💰 财务条款分析
- 📅 重要日期提醒
- 💡 专业改进建议
- 📊 合同质量评分

### AI 合同生成
1. 访问 `/ai-tools` 页面
2. 选择"合同生成"标签
3. 选择合同类型（软件开发、保密协议等）
4. 详细描述合同需求
5. 点击"生成合同"获取专业模板

支持的合同类型：
- 软件开发服务合同
- 保密协议（NDA）
- 采购合同
- 劳动合同
- 咨询服务合同
- 合作协议

### 系统状态监控
访问 `/setup` 页面可以：
- 🔍 检查数据库连接状态
- 🔑 验证环境变量配置
- 🤖 测试AI服务可用性
- 📊 查看系统信息

## 🔧 本地开发调试

### Mock 数据库模式

当 `DATABASE_URL` 环境变量未配置时，系统会自动切换到 Mock 数据库模式：

\`\`\`bash
# 启动 Mock 模式（无需数据库）
npm run dev

# 检查当前数据库模式
curl http://localhost:3000/api/system-info
\`\`\`

Mock 模式特点：
- 🚀 快速启动，无需配置
- 📊 包含示例数据
- 🔄 每次重启重置数据
- 🧪 适合开发和演示
\`\`\`

### 开发服务器命令

\`\`\`bash
# 启动开发服务器
npm run dev

# 启动开发服务器并显示详细日志
npm run dev -- --turbo

# 指定端口启动
npm run dev -- -p 3001
\`\`\`

### 数据库调试

\`\`\`bash
# 查看数据库结构
npx prisma studio

# 重置数据库
npx prisma db push --force-reset

# 查看数据库状态
npx prisma db pull

# 生成迁移文件
npx prisma migrate dev --name init
\`\`\`

### 环境变量调试

检查环境变量是否正确加载：

\`\`\`bash
# 在项目根目录创建 debug.js
echo "console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已配置' : '未配置')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '已配置' : '未配置')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '已配置' : '未配置')" > debug.js

# 运行调试脚本
node debug.js

# 删除调试文件
rm debug.js
\`\`\`

### 系统状态检查

访问 [http://localhost:3000/setup](http://localhost:3000/setup) 查看系统状态：

- 数据库连接状态
- 环境变量配置
- AI 服务状态
- 系统信息

### 日志调试

#### 1. 数据库查询日志

在 \`lib/prisma.ts\` 中启用查询日志：

\`\`\`typescript
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // 启用所有日志
})
\`\`\`

#### 2. NextAuth 调试

在 \`.env.local\` 中添加：

\`\`\`env
NEXTAUTH_DEBUG=true
\`\`\`

#### 3. API 路由调试

在 API 路由中添加详细日志：

\`\`\`typescript
console.log('Request method:', req.method)
console.log('Request body:', await req.json())
console.log('Session:', session)
\`\`\`

### 常见问题排查

#### 1. 数据库连接失败

\`\`\`bash
# 检查数据库连接
npx prisma db pull

# 测试连接
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('✅ 数据库连接成功'))
  .catch(err => console.error('❌ 数据库连接失败:', err))
  .finally(() => prisma.\$disconnect());
"
\`\`\`

#### 2. 认证问题

\`\`\`bash
# 检查 NextAuth 配置
curl -X GET http://localhost:3000/api/auth/providers

# 检查会话状态
curl -X GET http://localhost:3000/api/auth/session
\`\`\`

#### 3. AI 功能测试

\`\`\`bash
# 测试 OpenAI API 连接
curl -X POST http://localhost:3000/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"prompt": "测试AI服务连接"}'

# 测试合同分析功能
curl -X POST http://localhost:3000/api/contracts/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "这是一份测试合同内容"}'

# 测试合同生成功能
curl -X POST http://localhost:3000/api/contracts/generate \
  -H "Content-Type: application/json" \
  -d '{"type": "软件开发服务合同", "requirements": "开发一个网站"}'
\`\`\`

## 📦 常用命令

\`\`\`bash
# 开发相关
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

# 数据库相关
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送架构到数据库
npm run db:migrate   # 运行数据库迁移
npm run db:studio    # 打开 Prisma Studio
npm run db:seed      # 初始化数据库数据

# 类型检查
npx tsc --noEmit     # TypeScript 类型检查
\`\`\`

## 🌐 部署

### 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `DATABASE_URL` - Vercel Postgres 数据库连接字符串
- `DIRECT_URL` - 数据库直连URL（用于迁移）
- `NEXTAUTH_SECRET` - NextAuth.js 密钥
- `NEXTAUTH_URL` - 应用URL（生产环境）
- `OPENAI_API_KEY` - OpenAI API 密钥（必需，用于AI功能）

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

## 🔍 项目结构

\`\`\`
ai-contract-management/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 仪表板
│   └── setup/             # 系统设置
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── ...               # 自定义组件
├── lib/                   # 工具库
│   ├── auth-config.ts    # NextAuth 配置
│   ├── prisma.ts         # Prisma 客户端
│   └── ...               # 其他工具
├── prisma/               # 数据库相关
│   └── schema.prisma     # 数据库架构
├── public/               # 静态资源
└── ...                   # 配置文件
\`\`\`

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您遇到问题或需要帮助：

1. 查看 [常见问题](#常见问题排查) 部分
2. 访问 [/setup](http://localhost:3000/setup) 页面检查系统状态
3. 提交 Issue 到项目仓库

## 🎯 路线图

### 已完成 ✅
- [x] 用户认证和授权系统
- [x] AI 合同分析和生成
- [x] 数据库集成（Vercel Postgres）
- [x] 系统状态监控
- [x] 基础合同模板

### 开发中 🚧
- [ ] 合同版本控制
- [ ] 电子签名集成
- [ ] 文件上传和解析
- [ ] 合同模板管理

### 计划中 📋
- [ ] 批量操作功能
- [ ] 移动端适配
- [ ] 多语言支持
- [ ] 高级 AI 分析
- [ ] 集成第三方签名服务
- [ ] API 文档和 SDK
- [ ] 团队协作功能
- [ ] 合同工作流

---

**开发愉快！** 🚀
