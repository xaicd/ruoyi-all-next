/** @type {import('next').NextConfig} */

// 预览子路径支持（B2：同域名 path 前缀预览）
// 当应用被反代到形如 /api/tasks/host-preview/{id} 的子路径下预览时，
// 通过环境变量 PREVIEW_BASE_PATH 注入 Next.js 的 basePath + assetPrefix，
// 使 Link/router/_next 静态资源/API routes 自动挂到该前缀下。
// 不设置该变量时行为不变（应用运行在根路径 /，如子域名模式）。
// 注意：basePath 必须以 / 开头且不以 / 结尾。
const rawBasePath = (process.env.PREVIEW_BASE_PATH || "").trim();
const basePath = rawBasePath && rawBasePath !== "/"
  ? ("/" + rawBasePath.replace(/^\/+/, "").replace(/\/+$/, ""))
  : "";

const nextConfig = {
  distDir: ".next-ruoyi",
  output: "standalone",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  // 服务端外部包（pg/mysql2 不打入 bundle）
  serverExternalPackages: ["pg", "mysql2"],
  // 把最终生效的 basePath 暴露给客户端，供手写的 fetch("/api/...") 拼接前缀
  // （Next.js 的 basePath 不会自动改写代码里手写的字符串路径）
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
