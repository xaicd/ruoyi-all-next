const LOCK_QUEUE = new Map<string, Promise<unknown>>()

export async function withKeyedLock<T>(key: string, task: () => Promise<T> | T): Promise<T> {
  const prev = LOCK_QUEUE.get(key) ?? Promise.resolve()

  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })

  const queued = prev.then(() => gate)
  LOCK_QUEUE.set(key, queued)

  await prev
  try {
    return await task()
  } finally {
    release()
    if (LOCK_QUEUE.get(key) === queued) {
      LOCK_QUEUE.delete(key)
    }
  }
}

export function clearLockQueue() {
  LOCK_QUEUE.clear()
}
