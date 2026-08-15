import OnlineDefinitionDesignerPage from "@/modules/online/frontend/pages/online-definition-designer.page"

type PageProps = { params: Promise<{ code: string }> }

export default async function Page({ params }: PageProps) {
  const { code } = await params
  return <OnlineDefinitionDesignerPage code={code} />
}
