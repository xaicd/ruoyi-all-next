<template>
  <view class="container">
    <view class="header">
      <text class="title">库存流水</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="items.length === 0" class="empty">暂无数据</view>
    <view v-else class="list">
      <view v-for="item in items" :key="item.id" class="card">
        <text class="card-title">库存流水 #{{ item.id.slice(0, 8) }}</text>
        <text class="card-item">仓库ID: {{ item.warehouse_id || '-' }}</text>
        <text class="card-item">物料ID: {{ item.item_id || '-' }}</text>
        <text class="card-item">变动类型: {{ item.change_type || '-' }}</text>
        <text class="card-item">变动数量: {{ item.qty_change || '-' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchWmsInventoryHistoryList, type WmsInventoryHistoryItem } from '../api/wms-inventory-history.api'

const items = ref<WmsInventoryHistoryItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetchWmsInventoryHistoryList()
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
