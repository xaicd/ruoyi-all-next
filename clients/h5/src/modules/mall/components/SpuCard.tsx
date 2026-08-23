import React from 'react'
import { MallSpu } from '../models'

export function SpuCard({ spu }: { spu: MallSpu }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border shadow-sm flex flex-col">
      <img src={spu.picUrl || 'https://placehold.co/300x300'} alt={spu.name} className="w-full h-40 object-cover" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h4 className="font-medium text-sm line-clamp-2">{spu.name}</h4>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-red-500 font-bold text-base">¥{(spu.price / 100).toFixed(2)}</span>
          <span className="text-xs text-slate-400">已售 {spu.salesCount}</span>
        </div>
      </div>
    </div>
  )
}
