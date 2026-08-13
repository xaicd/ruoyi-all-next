import LoginPage from "@/modules/system/frontend/pages/login.page"

export const dynamic = "force-dynamic"

export default function Page() {
  const isDevelopment = process.env.NODE_ENV !== "production"
  const bootstrapCredentials = isDevelopment && process.env.ADMIN_BOOTSTRAP_USERNAME && process.env.ADMIN_BOOTSTRAP_PASSWORD
    ? { username: process.env.ADMIN_BOOTSTRAP_USERNAME, password: process.env.ADMIN_BOOTSTRAP_PASSWORD }
    : undefined
  return <LoginPage bootstrapCredentials={bootstrapCredentials} />
}
