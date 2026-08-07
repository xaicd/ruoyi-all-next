export const nextReactAdminFormComponentTemplate = `"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/modules/shared/frontend/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/shared/frontend/components/ui/form"
import { Input } from "@/modules/shared/frontend/components/ui/input"

const schema = z.object({
  name: z.string().min(1, "名称不能为空"),
  remark: z.string().max(200, "备注不能超过 200 字").optional(),
})

type FormValues = z.infer<typeof schema>

interface {{entityName}}FormProps {
  initialValues?: Partial<FormValues>
  onSubmit: (values: FormValues) => Promise<void> | void
  submitLabel?: string
}

export function {{entityName}}Form({
  initialValues,
  onSubmit,
  submitLabel = "保存{{entityName}}",
}: {{entityName}}FormProps) {
  const defaults = useMemo<FormValues>(() => ({
    name: initialValues?.name ?? "",
    remark: initialValues?.remark ?? "",
  }), [initialValues])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(async (values) => onSubmit(values))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Input placeholder="可选备注" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  )
}
`