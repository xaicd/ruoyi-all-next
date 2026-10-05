/** 公开元信息（外观 / 页面 schema）—— 不需要登录。 */
import { request } from "../../shared/request"
import type { Appearance, PageSchema } from "../../shared/types"

export const MetaApi = {
  /** 站点外观（品牌色 / logo / 布局密度）*/
  appearance: () => request<Appearance>({ url: "/api/v1/open/meta/appearance", showLoading: false }),

  /** 页面 schema（端无关字段协议，Web 与 Expo 共用）*/
  pageSchema: (entity: string) =>
    request<PageSchema>({ url: `/api/v1/open/meta/page-schema/${encodeURIComponent(entity)}` }),
}
