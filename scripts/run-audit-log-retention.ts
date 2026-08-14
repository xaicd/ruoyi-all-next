async function main() {
  const baseUrl = process.env.AUDIT_LOG_RETENTION_BASE_URL
  const token = process.env.AUDIT_LOG_RETENTION_TOKEN
  const execute = process.argv.includes("--execute")
  if (!baseUrl || !token) throw new Error("AUDIT_LOG_RETENTION_BASE_URL and AUDIT_LOG_RETENTION_TOKEN are required")
  if (execute && process.env.CONFIRM_AUDIT_LOG_RETENTION !== "DELETE_EXPIRED_AUDIT_LOGS") {
    throw new Error("Refusing deletion: set CONFIRM_AUDIT_LOG_RETENTION=DELETE_EXPIRED_AUDIT_LOGS with --execute")
  }
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/admin/infra/audit-log-retention`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ dryRun: !execute }),
  })
  const body = await response.json().catch(() => ({ message: "Non-JSON response" }))
  console.log(JSON.stringify({ status: response.status, traceId: response.headers.get("x-trace-id"), body }))
  if (!response.ok) process.exitCode = 1
}

main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })
