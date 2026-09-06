import LoginPage from "@/modules/system/frontend/pages/login.page"

export const dynamic = "force-dynamic"

export default function Page() {
  const isDevelopment = process.env.NODE_ENV !== "production"
  // 🆕 预览免输入登录：非生产 或 显式 NEXT_PUBLIC_DEMO_LOGIN 时，默认预填演示管理员 admin/admin123
  const demoMode = isDevelopment || process.env.NEXT_PUBLIC_DEMO_LOGIN === "1"
  const bootstrapCredentials = isDevelopment && process.env.ADMIN_BOOTSTRAP_USERNAME && process.env.ADMIN_BOOTSTRAP_PASSWORD
    ? { username: process.env.ADMIN_BOOTSTRAP_USERNAME, password: process.env.ADMIN_BOOTSTRAP_PASSWORD }
    : demoMode
    ? { username: "admin", password: "admin123" }
    : undefined
  return <LoginPage bootstrapCredentials={bootstrapCredentials} />
}
