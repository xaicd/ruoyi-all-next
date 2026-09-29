"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmProcessExpressionPage() {
  return <AdminListPageTemplate title="BpmProcessExpression管理" endpoint="/api/admin/bpm/bpm-process-expression" />
}
