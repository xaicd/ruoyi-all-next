import OnlineFormRuntimePage from "@/modules/online/frontend/pages/online-form-runtime.page"

type PageProps = { params: Promise<{ definitionCode: string }> }

export default async function Page({ params }: PageProps) {
  const { definitionCode } = await params
  return <OnlineFormRuntimePage definitionCode={definitionCode} />
}
