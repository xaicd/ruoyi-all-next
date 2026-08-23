import { http } from '../../../shared/http'
import { MallSpu } from '../models'

export const mallApi = {
  getSpuList: (params?: { page?: number; pageSize?: number }) =>
    http.get<{ list: MallSpu[]; total: number }>('/app/mall/spu/page', { params })
}
