import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  const classes = ["rounded-xl border border-slate-200 bg-white p-4", className]
    .filter(Boolean)
    .join(" ")
  return <div className={classes} {...props} />
}
