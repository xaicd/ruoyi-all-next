const loaded = new Set<string>()

export function resetContractActions() {
  loaded.clear()
}

export async function ensureContractActions(domain: string) {
  if (loaded.has(domain)) return
  loaded.add(domain)
  try {
    const mod = await import(`@/modules/${domain}/contract/actions`)
    if (typeof mod.registerActionSchemas === "function") {
      mod.registerActionSchemas()
    }
  } catch {
    // Domain has not published contract/actions yet.
  }
}
