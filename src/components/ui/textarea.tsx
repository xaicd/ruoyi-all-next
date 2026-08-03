import type { TextareaHTMLAttributes } from "react"

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  const classes = [
    "min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none",
    "focus:border-slate-500 focus:ring-1 focus:ring-slate-300",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <textarea className={classes} {...props} />
}
