/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发环境配置
  experimental: {
    // 开发环境禁用重定向
    // devRedirects: false,
  },
  // 其他配置
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
