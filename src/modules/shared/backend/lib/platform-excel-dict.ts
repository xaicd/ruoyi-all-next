type DictItem = {
  value: string
  label: string
}

export function dictTranslate(value: string, dictItems: DictItem[]) {
  const match = dictItems.find((item) => item.value === value)
  return match?.label ?? value
}

export function excelToCsv(headers: string[], rows: string[][]) {
  const head = headers.join(",")
  const body = rows.map((row) => row.join(",")).join("\n")
  return `${head}\n${body}`
}
