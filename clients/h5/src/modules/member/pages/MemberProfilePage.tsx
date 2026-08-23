import React, { useEffect, useState } from 'react'
import { MemberUser } from '../models'
import { memberApi } from '../api'
import { MemberAvatar } from '../components/MemberAvatar'
import { useNavigate } from 'react-router-dom'

export function MemberProfilePage() {
  const [user, setUser] = useState<MemberUser | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    memberApi.getProfile()
      .then(setUser)
      .catch(() => {
        // fallback demo user
        setUser({ id: '1', nickname: '体验会员', mobile: '138****8000', point: 120 })
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ruoyi_member_token')
    navigate('/login')
  }

  if (!user) return <div className="p-8 text-center text-slate-400">加载中...</div>

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
        <MemberAvatar url={user.avatar} name={user.nickname} />
        <div>
          <h3 className="font-bold text-lg">{user.nickname}</h3>
          <p className="text-xs text-slate-400">{user.mobile}</p>
          <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
            <span>✨ 积分: {user.point}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <button onClick={handleLogout} className="w-full text-center text-red-500 text-sm py-2 font-medium">
          退出登录
        </button>
      </div>
    </div>
  )
}
