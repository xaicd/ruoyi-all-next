/** 会员资料接口。UI 反馈策略在此声明，组件不重复写。 */
import { request } from "../../shared/request"
import type { MemberPublic } from "../../shared/types"

export const MemberUserApi = {
  profile: () => request<MemberPublic>({ url: "/api/v1/app/member/user/profile", auth: true }),

  updateProfile: (patch: { nickname?: string; avatarUrl?: string; extraFields?: Record<string, unknown> }) =>
    request<MemberPublic>({
      url: "/api/v1/app/member/user/profile",
      method: "PUT",
      data: patch,
      auth: true,
      custom: { showSuccess: true, successMsg: "已保存" },
    }),
}
