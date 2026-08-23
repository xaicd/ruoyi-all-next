import { z } from "zod"
import rawProjectProfile from "./project-profile.json"

const tenantSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1).max(32).regex(/^[a-z][a-z0-9-]*$/, "租户编码只允许小写字母、数字和连字符"),
  name: z.string().min(1).max(40),
  contactName: z.string().min(1).max(32).optional(),
  contactPhone: z.string().max(20).optional(),
  domain: z.string().max(80).nullable().optional(),
  packageId: z.string().min(1),
})

export const projectProfileSchema = z.object({
  platformName: z.string().min(1).max(40),
  shortName: z.string().min(1).max(16),
  description: z.string().min(1).max(200),
  copyright: z.string().min(1).max(80),
  version: z.string().min(1).max(20),
  loginHeadline: z.string().min(1).max(40),
  loginTagline: z.string().min(1).max(120),
  branding: z.object({
    mark: z.string().min(1).max(2),
    logoSrc: z.string().min(1),
    favicon: z.string().min(1),
  }),
  bootstrapAdmin: z.object({
    nickname: z.string().min(1).max(32),
  }),
  defaultUsers: z.array(z.object({
    username: z.string().min(1).max(32),
    nickname: z.string().min(1).max(32),
  })),
  tenants: z.array(tenantSchema).min(1),
  packages: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(40),
  })).min(1),
})

export type ProjectProfile = z.infer<typeof projectProfileSchema>
export type ProjectTenantProfile = z.infer<typeof tenantSchema>

export const projectProfile: ProjectProfile = projectProfileSchema.parse(rawProjectProfile)

export type PublicProjectProfile = Pick<
  ProjectProfile,
  "platformName" | "shortName" | "description" | "copyright" | "version" | "loginHeadline" | "loginTagline" | "branding"
>

/** Public branding for H5 / uni-app / Flutter / desktop. Never includes accounts or tenant secrets. */
export function toPublicProjectProfile(profile: ProjectProfile = projectProfile): PublicProjectProfile {
  return {
    platformName: profile.platformName,
    shortName: profile.shortName,
    description: profile.description,
    copyright: profile.copyright,
    version: profile.version,
    loginHeadline: profile.loginHeadline,
    loginTagline: profile.loginTagline,
    branding: profile.branding,
  }
}
