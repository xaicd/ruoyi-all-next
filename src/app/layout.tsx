import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ruoyi-all-next",
  description: "RuoYi Next full-stack baseline",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
