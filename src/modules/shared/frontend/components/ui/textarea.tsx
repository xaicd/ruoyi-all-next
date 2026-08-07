import type { TextareaHTMLAttributes } from "react"

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none ${className}`}
      {...props}
    />
  )
}
