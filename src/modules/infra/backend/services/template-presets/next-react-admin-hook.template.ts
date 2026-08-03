export const nextReactAdminHookTemplate = `"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { list{{entityName}} } from "@/frontend/services/{{modulePath}}"

interface Use{{entityName}}ListInput {
  keyword?: string
  page?: number
  pageSize?: number
}

export function use{{entityName}}List(input: Use{{entityName}}ListInput) {
  const queryKey = useMemo(
    () => ["{{modulePath}}", "list", input.keyword ?? "", input.page ?? 1, input.pageSize ?? 20],
    [input.keyword, input.page, input.pageSize],
  )

  return useQuery({
    queryKey,
    queryFn: () => list{{entityName}}(input.keyword),
  })
}
`