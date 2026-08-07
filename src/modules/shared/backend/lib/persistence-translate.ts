type TranslateDict = Record<string, string>

export function translateByDict(value: string, dict: TranslateDict) {
  return dict[value] ?? value
}
