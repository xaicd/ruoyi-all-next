import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { memberApi } from '../api'

export function MemberLoginPage() {
  const [mobile, setMobile] = useState('13800138000')
  const [code, setCode] = useState('123456')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await memberApi.login({ mobile, code })
      if (res.token) {
        localStorage.setItem('ruoyi_member_token', res.token)
        navigate('/profile')
      }
    } catch (err: any) {
      alert(err.message || '登录失败')
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mt-8">
      <h2 className="text-xl font-bold mb-6 text-center">快捷会员登录</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">手机号码</label>
          <input
            type="tel"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">验证码</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition">
          立即登录
        </button>
      </form>
    </div>
  )
}
