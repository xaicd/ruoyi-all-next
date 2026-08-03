import type { LabelHTMLAttributes } from "react"

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className, ...props }: LabelProps) {
  const classes = ["text-sm font-medium text-slate-700", className].filter(Boolean).join(" ")
  return <label className={classes} {...props} />
}
