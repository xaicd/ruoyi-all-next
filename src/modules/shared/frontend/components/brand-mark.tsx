"use client"

import { projectProfile } from "@/modules/shared/contract/project-profile"

type BrandMarkProps = {
  size?: number
  withName?: boolean
  nameClassName?: string
  inverted?: boolean
}

export function BrandMark({ size = 32, withName = false, nameClassName, inverted = false }: BrandMarkProps) {
  const { branding, platformName, shortName } = projectProfile
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src={branding.logoSrc}
        alt={platformName}
        width={size}
        height={size}
        className="shrink-0 rounded-lg object-contain"
        style={{ width: size, height: size }}
      />
      {withName && (
        <span className={nameClassName ?? (inverted ? "text-sm font-semibold text-white" : "text-sm font-semibold text-slate-900")}>
          {shortName}
        </span>
      )}
    </span>
  )
}
