import {
  type CodegenConfig,
  type CodegenOutput,
  formColumns,
  toKebab,
} from "./common"

export function generateClientUniApp(config: CodegenConfig): CodegenOutput[] {
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)
  const displayCols = formColumns(config).slice(0, 4)

  const apiContent = `// Auto-generated UniApp SDK for ${businessName}
import { request } from "@/shared/lib/request"

export interface ${className}Item {
  id: string
${displayCols.map((c) => `  ${c.name}?: ${c.tsType}`).join("\n")}
  createTime?: string
}

export function fetch${className}List(params?: { page?: number; pageSize?: number }) {
  return request<{ items: ${className}Item[]; total: number }>({
    url: "/api/v1/app/${moduleName}/${kebab}",
    method: "GET",
    data: params,
  })
}
`

  const vueContent = `<template>
  <view class="container">
    <view class="header">
      <text class="title">${businessName}</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="items.length === 0" class="empty">暂无数据</view>
    <view v-else class="list">
      <view v-for="item in items" :key="item.id" class="card">
        <text class="card-title">${businessName} #{{ item.id.slice(0, 8) }}</text>
${displayCols.map((c) => `        <text class="card-item">${c.comment || c.name}: {{ item.${c.name} || '-' }}</text>`).join("\n")}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetch${className}List, type ${className}Item } from '../api/${kebab}.api'

const items = ref<${className}Item[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch${className}List()
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
`

  return [
    {
      path: `clients/uniapp/src/modules/${moduleName}/api/${kebab}.api.ts`,
      content: apiContent,
      type: "api",
    },
    {
      path: `clients/uniapp/src/modules/${moduleName}/pages/${kebab}.vue`,
      content: vueContent,
      type: "page",
    },
  ]
}
