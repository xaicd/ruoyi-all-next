import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
  traceId?: string
}

class HttpClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Channel': 'h5'
      }
    })

    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('ruoyi_member_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const res = response.data
        if (res.code === 0 || res.code === 200) {
          return res.data
        }
        if (res.code === 401 || res.code === 40100) {
          localStorage.removeItem('ruoyi_member_token')
          window.location.href = '/login'
        }
        return Promise.reject(new Error(res.msg || 'Error'))
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

export const http = new HttpClient()
