type WebSocketSession = {
  wsSessionId: string
  userId: string
}

const SESSIONS = new Map<string, WebSocketSession>()
const WS_MESSAGES: Array<{ wsSessionId: string; message: string }> = []

export function websocketConnect(session: WebSocketSession) {
  SESSIONS.set(session.wsSessionId, session)
}

export function websocketSend(wsSessionId: string, message: string) {
  if (!SESSIONS.has(wsSessionId)) {
    throw new Error("websocket session not found")
  }
  WS_MESSAGES.push({ wsSessionId, message })
}

export function listWebsocketMessages() {
  return [...WS_MESSAGES]
}

export function clearWebsocketHub() {
  SESSIONS.clear()
  WS_MESSAGES.length = 0
}
