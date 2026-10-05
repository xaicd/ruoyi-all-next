/**
 * 会员认证接口（对标 uniapp 的 `sheep/api/<域>/<实体>.js`）。
 *
 * UI 反馈策略**在这里声明**（custom 块），组件只调方法、不写 loading / 提示。
 */
import { request, setToken } from "../../shared/request"
import type { MemberPublic } from "../../shared/types"

export const MemberAuthApi = {
  /** 账号 + 密码登录 */
  login: (data: { account: string; password: string }) =>
    request<{ token: string; expiresIn: number; member: MemberPublic }>({
      url: "/api/v1/app/member/auth/login",
      method: "POST",
      data,
      custom: { showSuccess: true, loadingMsg: "登录中", successMsg: "登录成功" },
    }).then((result) => {
      // token 的落点收在 api 层，组件不碰
      setToken(result.token)
      return result
    }),

  /** 发送短信验证码 */
  sendSmsCode: (data: { mobile: string; scene: string }) =>
    request<{ send: boolean }>({
      url: "/api/v1/app/member/auth/send-sms-code",
      method: "POST",
      data,
      custom: { loadingMsg: "发送中", showSuccess: true, successMsg: "验证码已发送" },
    }),

  /** 短信验证码登录 */
  smsLogin: (data: { mobile: string; code: string }) =>
    request<{ token: string; expiresIn: number; member: MemberPublic }>({
      url: "/api/v1/app/member/auth/sms-login",
      method: "POST",
      data,
      custom: { showSuccess: true, loadingMsg: "登录中", successMsg: "登录成功" },
    }).then((result) => {
      setToken(result.token)
      return result
    }),

  /** 退出登录 */
  logout: () =>
    request<null>({ url: "/api/v1/app/member/auth/logout", method: "POST", auth: true }).finally(() => setToken(null)),
}
