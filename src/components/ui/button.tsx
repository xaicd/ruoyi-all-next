import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary"
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  const base = "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm transition"
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      : variant === "secondary"
        ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
        : "bg-slate-900 text-white hover:bg-slate-800"
  const classes = [base, styles, className].filter(Boolean).join(" ")

  return <button className={classes} {...props} />
}
