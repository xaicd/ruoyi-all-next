<template>
  <view class="container">
    <view class="header">
      <text class="title">盘点明细</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="items.length === 0" class="empty">暂无数据</view>
    <view v-else class="list">
      <view v-for="item in items" :key="item.id" class="card">
        <text class="card-title">盘点明细 #{{ item.id.slice(0, 8) }}</text>
        <text class="card-item">关联盘点单ID: {{ item.check_order_id || '-' }}</text>
        <text class="card-item">物料ID: {{ item.item_id || '-' }}</text>
        <text class="card-item">账面数量: {{ item.system_qty || '-' }}</text>
        <text class="card-item">实盘数量: {{ item.check_qty || '-' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchWmsCheckOrderDetailList, type WmsCheckOrderDetailItem } from '../api/wms-check-order-detail.api'

const items = ref<WmsCheckOrderDetailItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetchWmsCheckOrderDetailList()
    items.value = res.data?.items || []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container { padding: 16px; background-color: #f8fafc; min-height: 100vh; }
.header { margin-bottom: 12px; }
.title { font-size: 18px; font-weight: bold; color: #0f172a; }
.list { display: flex; flex-direction: column; gap: 10px; }
.card { background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
.card-title { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 4px; display: block; }
.card-item { font-size: 12px; color: #64748b; margin-bottom: 2px; display: block; }
.loading, .empty { text-align: center; font-size: 13px; color: #94a3b8; padding: 40px 0; }
</style>
