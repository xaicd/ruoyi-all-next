import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg"
}

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50"
  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 hover:bg-slate-50",
    ghost: "hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }
  const sizes: Record<string, string> = {
    default: "h-9 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-10 px-6 text-base",
  }
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
}
