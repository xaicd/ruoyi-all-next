function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value)
  // Prevent spreadsheet formula evaluation when an exported cell is opened in Excel/Sheets.
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${safe.replace(/"/g, '""')}"`
}

export function csvResponse(filename: string, headers: string[], rows: unknown[][]): Response {
  const body = `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
