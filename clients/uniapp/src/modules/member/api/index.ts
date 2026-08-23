import { request } from '../../../shared/http'
import { MemberUser } from '../models'

export const memberApi = {
  login: (data: { mobile: string; code: string }) => request<{ token: string; user: MemberUser }>({ url: '/app/member/auth/login', method: 'POST', data }),
  getProfile: () => request<MemberUser>({ url: '/app/member/user/profile', method: 'GET' })
}
