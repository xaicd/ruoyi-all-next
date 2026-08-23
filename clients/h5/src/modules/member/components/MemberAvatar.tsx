import React from 'react'

export function MemberAvatar({ url, name }: { url?: string; name: string }) {
  return (
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border">
      {url ? <img src={url} alt={name} className="w-full h-full rounded-full object-cover" /> : name.slice(0, 1)}
    </div>
  )
}
