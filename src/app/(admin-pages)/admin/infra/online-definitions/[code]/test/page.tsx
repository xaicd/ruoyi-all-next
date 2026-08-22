import { redirect } from "next/navigation"

type PageProps = { params: Promise<{ code: string }> }

export default async function Page({ params }: PageProps) {
  const { code } = await params
  redirect(`/admin/infra/online-runtime/${encodeURIComponent(code)}`)
}
