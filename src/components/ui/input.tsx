import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  const classes = [
    "h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none",
    "focus:border-slate-500 focus:ring-1 focus:ring-slate-300",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <input className={classes} {...props} />
}
