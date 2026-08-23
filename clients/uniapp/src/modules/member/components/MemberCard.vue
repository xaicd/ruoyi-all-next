<template>
  <view class="member-card">
    <image class="avatar" :src="user.avatar || '/static/avatar.png'" />
    <view class="info">
      <text class="nickname">{{ user.nickname }}</text>
      <text class="mobile">{{ user.mobile }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { MemberUser } from '../models'
defineProps<{ user: MemberUser }>()
</script>

<style scoped>
.member-card { display: flex; align-items: center; padding: 20rpx; background: #fff; border-radius: 16rpx; }
.avatar { width: 100rpx; height: 100rpx; border-radius: 50%; margin-right: 20rpx; }
.nickname { font-size: 32rpx; font-weight: bold; }
.mobile { font-size: 24rpx; color: #999; }
</style>
