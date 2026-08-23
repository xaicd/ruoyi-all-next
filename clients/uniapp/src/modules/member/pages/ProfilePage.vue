<template>
  <view class="profile-page">
    <MemberCard :user="user" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { memberApi } from '../api'
import MemberCard from '../components/MemberCard.vue'

const user = ref({ id: '1', nickname: 'UniApp 会员', mobile: '138****0000', point: 100 })

onMounted(async () => {
  try {
    const res = await memberApi.getProfile()
    if (res) user.value = res
  } catch (e) {}
})
</script>
