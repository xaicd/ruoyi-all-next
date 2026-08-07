/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-ruoyi",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
