import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { MemberLoginPage } from '../modules/member/pages/MemberLoginPage'
import { MemberProfilePage } from '../modules/member/pages/MemberProfilePage'
import { MallProductListPage } from '../modules/mall/pages/MallProductListPage'
import { fetchProjectProfile, ProjectProfile } from '../shared/profile'

export function App() {
  const [profile, setProfile] = useState<ProjectProfile>({
    name: 'RuoYi Mobile',
    shortName: 'RuoYi',
    logo: '/branding/logo.svg',
    copyright: '© 2026 RuoYi All Next'
  })

  useEffect(() => {
    fetchProjectProfile()
      .then(setProfile)
      .catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-blue-600">{profile.name}</span>
          </div>
        </header>

        <main className="p-4 max-w-md mx-auto">
          <Routes>
            <Route path="/" element={<MallProductListPage />} />
            <Route path="/mall" element={<MallProductListPage />} />
            <Route path="/login" element={<MemberLoginPage />} />
            <Route path="/profile" element={<MemberProfilePage />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 max-w-md mx-auto">
          <Link to="/mall" className="text-xs text-center flex flex-col items-center">
            <span>🛍️</span>
            <span>商城</span>
          </Link>
          <Link to="/profile" className="text-xs text-center flex flex-col items-center">
            <span>👤</span>
            <span>我的</span>
          </Link>
        </nav>
      </div>
    </BrowserRouter>
  )
}
