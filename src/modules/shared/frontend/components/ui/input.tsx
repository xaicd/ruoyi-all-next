import type { InputHTMLAttributes } from "react"

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-9 w-full rounded-md border border-slate-300 px-3 text-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none ${className}`}
      {...props}
    />
  )
}
