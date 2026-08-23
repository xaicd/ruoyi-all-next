import { http } from '../../../shared/http'
import { MemberUser } from '../models'

export const memberApi = {
  login: (data: { mobile: string; code: string }) => http.post<{ token: string; user: MemberUser }>('/app/member/auth/login', data),
  getProfile: () => http.get<MemberUser>('/app/member/user/profile'),
  updateProfile: (data: Partial<MemberUser>) => http.put('/app/member/user/profile', data)
}
