import { describe, it, expect } from "vitest"
import {
  SUPPORTED_LOCALES,
  TRANSLATIONS,
  DEFAULT_LOCALE,
  LocaleCode,
} from "../../packages/shared/frontend/lib/i18n"

describe("i18n Enterprise Multi-Language Engine (四语国际化引擎)", () => {
  it("必须支持中、英、日、韩四种官方语言定义与对应国旗", () => {
    const codes = SUPPORTED_LOCALES.map((l) => l.code)
    expect(codes).toContain("zh-CN")
    expect(codes).toContain("en-US")
    expect(codes).toContain("ja-JP")
    expect(codes).toContain("ko-KR")
    expect(DEFAULT_LOCALE).toBe("zh-CN")

    const zh = SUPPORTED_LOCALES.find((l) => l.code === "zh-CN")
    const en = SUPPORTED_LOCALES.find((l) => l.code === "en-US")
    const ja = SUPPORTED_LOCALES.find((l) => l.code === "ja-JP")
    const ko = SUPPORTED_LOCALES.find((l) => l.code === "ko-KR")

    expect(zh?.flag).toBe("🇨🇳")
    expect(en?.flag).toBe("🇺🇸")
    expect(ja?.flag).toBe("🇯🇵")
    expect(ko?.flag).toBe("🇰🇷")
  })

  it("四种语言必须完整覆盖通用导航、核心动作与消息字典", () => {
    const requiredKeys = [
      "nav.portalHome",
      "nav.searchMenu",
      "nav.logout",
      "action.create",
      "action.edit",
      "action.delete",
      "action.search",
      "action.save",
      "field.name",
      "field.status",
      "msg.success",
      "msg.failed",
    ]

    const locales: LocaleCode[] = ["zh-CN", "en-US", "ja-JP", "ko-KR"]

    for (const loc of locales) {
      const dict = TRANSLATIONS[loc]
      expect(dict).toBeDefined()
      for (const key of requiredKeys) {
        expect(dict[key], `Language ${loc} missing key ${key}`).toBeTruthy()
      }
    }
  })

  it("各语言内容语义正确，非空且具备母语表达特征", () => {
    expect(TRANSLATIONS["zh-CN"]["action.create"]).toBe("新建")
    expect(TRANSLATIONS["en-US"]["action.create"]).toBe("Create")
    expect(TRANSLATIONS["ja-JP"]["action.create"]).toBe("新規作成")
    expect(TRANSLATIONS["ko-KR"]["action.create"]).toBe("새로 만들기")

    expect(TRANSLATIONS["zh-CN"]["nav.logout"]).toBe("退出")
    expect(TRANSLATIONS["en-US"]["nav.logout"]).toBe("Logout")
    expect(TRANSLATIONS["ja-JP"]["nav.logout"]).toBe("ログアウト")
    expect(TRANSLATIONS["ko-KR"]["nav.logout"]).toBe("로그아웃")
  })
})
