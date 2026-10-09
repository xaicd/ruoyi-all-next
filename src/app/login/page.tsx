import LoginPage from "@/modules/system/frontend/pages/login.page"

export const dynamic = "force-dynamic"

export default function Page() {
  const isDevelopment = process.env.NODE_ENV !== "production"
  // 仅在本地开发环境且 .env.local 已注入引导凭证时自动预填，严禁任何硬编码 admin / admin123 弱口令
  const bootstrapCredentials = isDevelopment && process.env.ADMIN_BOOTSTRAP_USERNAME && process.env.ADMIN_BOOTSTRAP_PASSWORD
    ? { username: process.env.ADMIN_BOOTSTRAP_USERNAME, password: process.env.ADMIN_BOOTSTRAP_PASSWORD }
    : undefined
  return <LoginPage bootstrapCredentials={bootstrapCredentials} />
}
