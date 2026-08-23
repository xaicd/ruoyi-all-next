export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

export function request<T = any>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('ruoyi_member_token')
    uni.request({
      ...options,
      url: (options.url.startsWith('http') ? '' : '/api/v1') + options.url,
      header: {
        'Content-Type': 'application/json',
        'X-Client-Channel': 'uniapp',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        const data = res.data as ApiResponse<T>
        if (data.code === 0 || data.code === 200) {
          resolve(data.data)
        } else {
          uni.showToast({ title: data.msg || '请求失败', icon: 'none' })
          reject(new Error(data.msg))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接异常', icon: 'none' })
        reject(err)
      }
    })
  })
}
