/**
 * In-process admin session registry. JWT stays the token; this tracks live sessions
 * for online-user listing and force-logout without a ZooKeeper-style method catalog.
 */
export type AdminSession = {
  sessionId: string
  userId: string
  username: string
  nickname: string
  userIp: string
  loginTime: string
  expiresAt: string
}

const sessions = new Map<string, AdminSession>()
const revoked = new Set<string>()

export function resetAdminSessions() {
  sessions.clear()
  revoked.clear()
}

export function registerAdminSession(session: AdminSession) {
  revoked.delete(session.sessionId)
  sessions.set(session.sessionId, session)
}

export function revokeAdminSession(sessionId: string) {
  sessions.delete(sessionId)
  revoked.add(sessionId)
}

export function revokeAdminSessionsForUser(userId: string) {
  for (const [sessionId, session] of sessions) {
    if (session.userId === userId) {
      sessions.delete(sessionId)
      revoked.add(sessionId)
    }
  }
}

export function isAdminSessionRevoked(sessionId: string | undefined): boolean {
  return Boolean(sessionId && revoked.has(sessionId))
}

export function purgeExpiredAdminSessions(now = Date.now()) {
  for (const [sessionId, session] of sessions) {
    if (Date.parse(session.expiresAt) <= now) sessions.delete(sessionId)
  }
}

export function listAdminSessions(keyword?: string): AdminSession[] {
  purgeExpiredAdminSessions()
  const kw = keyword?.toLowerCase()
  return [...sessions.values()].filter((session) => {
    if (!kw) return true
    return session.username.toLowerCase().includes(kw) || session.nickname.toLowerCase().includes(kw)
  })
}
