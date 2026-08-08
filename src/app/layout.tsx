import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "RuoYi All Next",
    template: "%s - RuoYi Admin",
  },
  description: "基于 Next.js 15 的企业级全栈管理平台",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
