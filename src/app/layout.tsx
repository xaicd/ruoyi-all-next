import type { Metadata } from "next"
import { projectProfile } from "@/modules/shared/contract/project-profile"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: projectProfile.platformName,
    template: `%s · ${projectProfile.shortName}`,
  },
  description: projectProfile.description,
  icons: { icon: projectProfile.branding.favicon },
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
