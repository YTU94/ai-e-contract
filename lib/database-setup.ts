// Database setup utilities for Vercel Postgres
import { prisma } from "./prisma"

export async function setupDatabase() {
  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // 检查数据库是否已初始化
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)

    return { success: true, userCount }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return { success: false, error }
  } finally {
    await prisma.$disconnect()
  }
}

export async function seedDatabase() {
  try {
    // 创建默认合同模板
    const templates = [
      {
        name: "软件开发服务合同",
        description: "标准软件开发服务合同模板",
        category: "技术服务",
        content: `
# 软件开发服务合同

## 甲方（委托方）
公司名称：[甲方公司名称]
地址：[甲方地址]
联系人：[联系人姓名]
电话：[联系电话]

## 乙方（开发方）
公司名称：[乙方公司名称]
地址：[乙方地址]
联系人：[联系人姓名]
电话：[联系电话]

## 项目概述
项目名称：[项目名称]
开发周期：[开发周期]
项目预算：[项目预算]

## 服务内容
1. 需求分析和系统设计
2. 软件开发和编码
3. 系统测试和调试
4. 部署和上线支持
5. 维护和技术支持

## 交付成果
1. 完整的软件系统
2. 源代码和技术文档
3. 用户操作手册
4. 系统部署文档

## 付款方式
1. 签约时支付30%
2. 开发完成支付60%
3. 验收通过支付10%

## 知识产权
[知识产权条款]

## 保密条款
[保密条款内容]

## 违约责任
[违约责任条款]

## 争议解决
[争议解决条款]
        `,
      },
      {
        name: "保密协议",
        description: "标准保密协议模板",
        category: "法律文件",
        content: `
# 保密协议

## 甲方
公司名称：[甲方公司名称]
地址：[甲方地址]

## 乙方
公司名称：[乙方公司名称]
地址：[乙方地址]

## 保密信息定义
本协议所称保密信息包括但不限于：
1. 技术信息
2. 商业信息
3. 财务信息
4. 客户信息
5. 其他标记为保密的信息

## 保密义务
1. 严格保密
2. 限制使用
3. 妥善保管
4. 及时归还

## 保密期限
保密期限为[保密期限]年

## 违约责任
[违约责任条款]

## 其他条款
[其他相关条款]
        `,
      },
      {
        name: "采购合同",
        description: "标准采购合同模板",
        category: "商务合同",
        content: `
# 采购合同

## 买方（甲方）
公司名称：[买方公司名称]
地址：[买方地址]

## 卖方（乙方）
公司名称：[卖方公司名称]
地址：[卖方地址]

## 采购清单
| 商品名称 | 规格型号 | 数量 | 单价 | 总价 |
|---------|---------|------|------|------|
| [商品1] | [规格1] | [数量1] | [单价1] | [总价1] |
| [商品2] | [规格2] | [数量2] | [单价2] | [总价2] |

## 交付条款
交付时间：[交付时间]
交付地点：[交付地点]
运输方式：[运输方式]

## 付款条款
付款方式：[付款方式]
付款期限：[付款期限]

## 质量标准
[质量标准条款]

## 验收条款
[验收条款内容]

## 违约责任
[违约责任条款]
        `,
      },
    ]

    for (const template of templates) {
      await prisma.contractTemplate.upsert({
        where: { name: template.name },
        update: template,
        create: template,
      })
    }

    console.log("✅ Database seeded successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    return { success: false, error }
  } finally {
    await prisma.$disconnect()
  }
}

export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  userId?: string,
  details?: any,
  request?: Request,
) {
  try {
    const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip")
    const userAgent = request?.headers.get("user-agent")

    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        details,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
  } finally {
    await prisma.$disconnect()
  }
}
