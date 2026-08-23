import React, { useEffect, useState } from 'react'
import { MallSpu } from '../models'
import { mallApi } from '../api'
import { SpuCard } from '../components/SpuCard'

export function MallProductListPage() {
  const [products, setProducts] = useState<MallSpu[]>([
    { id: '1', name: '全链路微服务架构实战指南', picUrl: '', price: 9900, salesCount: 320 },
    { id: '2', name: 'Next.js 15 企业级中后台开发套件', picUrl: '', price: 19900, salesCount: 580 }
  ])

  useEffect(() => {
    mallApi.getSpuList()
      .then((res) => { if (res.list && res.list.length) setProducts(res.list) })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((spu) => (
          <SpuCard key={spu.id} spu={spu} />
        ))}
      </div>
    </div>
  )
}
