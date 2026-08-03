"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function {{modulePascal}}{{featureListPascal}}Page() {
  return <AdminListPageTemplate title="{{moduleLabel}}{{featureListLabel}}" endpoint="/api/admin/{{moduleKebab}}/{{featureListKebab}}" />
}
