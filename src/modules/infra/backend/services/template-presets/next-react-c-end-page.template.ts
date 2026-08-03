export const nextReactCEndPageTemplate = `"use client"

import { useMemo } from "react"
import { PageContainer, Section, Card, Tag } from "@/frontend/components/ui-system"

type Item = {
  id: string
  title: string
  price: number
}

export default function {{entityName}}MobilePage() {
  const items = useMemo<Item[]>(() => [], [])

  return (
    <PageContainer withBottomNav maxWidth="md" className="bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fff_35%,_#f8fafc_100%)]">
      <Section title="{{entityName}} 推荐" subtitle="移动端精选模板页面" className="pt-3">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">活动进行中</p>
                </div>
                <Tag variant="primary">热门推荐</Tag>
              </div>
              <p className="mt-3 text-lg font-semibold text-primary-700">¥{item.price}</p>
            </Card>
          ))}
          {items.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-sm font-medium text-slate-700">暂无{{entityName}}内容</p>
              <p className="mt-1 text-xs text-slate-500">请稍后再来查看精选内容</p>
            </Card>
          )}
        </div>
      </Section>
    </PageContainer>
  )
}
`
