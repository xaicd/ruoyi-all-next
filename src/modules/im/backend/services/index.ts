import type { ImMessageAuditInput, ImPageQueryInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type ImConversation = {
  id: string
  type: "PRIVATE" | "GROUP"
  title: string
  unread: number
}

const MOCK_CONVERSATIONS: ImConversation[] = [
  { id: "im-cv-001", type: "GROUP", title: "乡镇运营群", unread: 18 },
  { id: "im-cv-002", type: "PRIVATE", title: "客服会话-王小明", unread: 2 },
]

export class ImService {
  static async listConversations(input: ImPageQueryInput) {
    domainLog.event("im.conversation.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_CONVERSATIONS.filter(
          (item) => item.title.toLowerCase().includes(keyword) || item.type.toLowerCase().includes(keyword),
        )
      : MOCK_CONVERSATIONS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async auditMessage(input: ImMessageAuditInput) {
    const conversation = MOCK_CONVERSATIONS.find((item) => item.id === input.conversationId)
    if (!conversation) {
      throw new Error("会话不存在")
    }

    domainLog.event("im.message.audit", {
      conversationId: input.conversationId,
      messageId: input.messageId,
      decision: input.decision,
    })
    domainLog.audit("im.message.audit", {
      targetType: "IM_MESSAGE",
      targetId: input.messageId,
      decision: input.decision,
    })

    return {
      conversationId: input.conversationId,
      messageId: input.messageId,
      decision: input.decision,
      reason: input.reason ?? null,
      reviewedAt: new Date().toISOString(),
    }
  }
}
