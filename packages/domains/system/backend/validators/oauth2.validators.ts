import { z } from "zod"

// === OAuth2 ===
export const oauth2OpenTokenSchema = z.object({
  clientId: z.string().trim().min(1, "clientId 不能为空"),
  clientSecret: z.string().trim().min(1, "clientSecret 不能为空"),
  grantType: z.enum(["password", "client_credentials"]).default("password"),
  username: z.string().trim().optional(),
  password: z.string().trim().optional(),
})

export const oauth2UserInfoSchema = z.object({
  accessToken: z.string().trim().min(1, "accessToken 不能为空"),
})

export type Oauth2OpenTokenInput = z.infer<typeof oauth2OpenTokenSchema>
export type Oauth2UserInfoInput = z.infer<typeof oauth2UserInfoSchema>
