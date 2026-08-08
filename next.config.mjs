/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-ruoyi",
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 服务端外部包（pg/mysql2 不打入 bundle）
  serverExternalPackages: ["pg", "mysql2"],
}

export default nextConfig
