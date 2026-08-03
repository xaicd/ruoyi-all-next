export const nextReactAdminTableColumnsTemplate = `import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export interface {{entityName}}TableRow {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
}

export function build{{entityName}}Columns(): ColumnDef<{{entityName}}TableRow>[] {
  return [
    {
      accessorKey: "name",
      header: "名称",
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const value = row.original.status
        return (
          <Badge variant={value === "ACTIVE" ? "default" : "secondary"}>
            {value}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
    },
  ]
}
`