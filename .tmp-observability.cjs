"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redact = redact;
exports.summarizeError = summarizeError;
exports.registerLogSink = registerLogSink;
exports.writeStructuredLog = writeStructuredLog;
exports.writeCompactError = writeCompactError;
exports.resolveApiAccessOutcome = resolveApiAccessOutcome;
exports.recordApiAccess = recordApiAccess;
const trace_context_1 = require("./trace-context");
const SENSITIVE_KEY = /password|secret|token|authorization|cookie|credential|api[-_]?key/i;
const sinks = new Set();
const errorWindows = new Map();
const ERROR_WINDOW_MS = 60000;
function redactText(value) {
    return value.replace(/:\/\/([^:\s]+):([^@\s]+)@/g, "://$1:***@").replace(/(password|token|secret)=([^\s&]+)/gi, "$1=***");
}
function redact(value) {
    if (typeof value === "string")
        return redactText(value);
    if (Array.isArray(value))
        return value.map(redact);
    if (!value || typeof value !== "object")
        return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SENSITIVE_KEY.test(key) ? "***" : redact(item)]));
}
function asError(value) {
    return value instanceof Error ? value : undefined;
}
function errorCandidates(error) {
    const queue = [error];
    const result = [];
    const seen = new Set();
    while (queue.length && result.length < 12) {
        const item = queue.shift();
        if (!item || seen.has(item))
            continue;
        seen.add(item);
        const current = asError(item);
        if (!current)
            continue;
        result.push(current);
        if (current.cause)
            queue.push(current.cause);
        if (Array.isArray(current.errors))
            queue.push(...current.errors);
    }
    return result;
}
function summarizeError(error) {
    var _a;
    const candidates = errorCandidates(error);
    const root = (_a = candidates.find((item) => item.code || item.message)) !== null && _a !== void 0 ? _a : new Error("Unknown error");
    const stack = candidates.map((item) => item.stack).find(Boolean);
    const location = stack === null || stack === void 0 ? void 0 : stack.split("\n").map((line) => line.trim()).find((line) => line.startsWith("at ") && !line.includes("node_modules") && !line.includes(".next-ruoyi"));
    return { name: root.name || "Error", code: root.code, message: root.message || `${root.name || "Error"}${root.code ? ` (${root.code})` : ""}`, location };
}
/** Register a non-blocking sink, e.g. a database, queue, or OpenTelemetry exporter. */
function registerLogSink(sink) {
    sinks.add(sink);
    return () => sinks.delete(sink);
}
function writeStructuredLog(level, event, fields) {
    const record = { timestamp: new Date().toISOString(), level, event, traceId: trace_context_1.traceContext.getTraceId(), fields: fields ? redact(fields) : undefined };
    const line = JSON.stringify(record);
    if (level === "error")
        console.error(line);
    else if (level === "warn")
        console.warn(line);
    else
        console.info(line);
    for (const sink of sinks)
        Promise.resolve(sink(record)).catch((error) => console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", event: "observability.sink.failed", traceId: record.traceId, fields: { error: summarizeError(error) } })));
}
/** Emits one compact error per fingerprint per minute and reports suppressed duplicates on the next emission. */
function writeCompactError(event, error, fields) {
    var _a, _b, _c, _d;
    const summary = summarizeError(error);
    const fingerprint = `${event}:${(_a = summary.code) !== null && _a !== void 0 ? _a : summary.name}:${String((_b = fields === null || fields === void 0 ? void 0 : fields.stage) !== null && _b !== void 0 ? _b : "")}:${String((_c = fields === null || fields === void 0 ? void 0 : fields.path) !== null && _c !== void 0 ? _c : "")}`;
    const now = Date.now();
    const window = errorWindows.get(fingerprint);
    if (window && now - window.startedAt < ERROR_WINDOW_MS) {
        window.suppressed += 1;
        return summary;
    }
    const suppressedCount = (_d = window === null || window === void 0 ? void 0 : window.suppressed) !== null && _d !== void 0 ? _d : 0;
    errorWindows.set(fingerprint, { startedAt: now, suppressed: 0 });
    writeStructuredLog("error", event, Object.assign(Object.assign(Object.assign({}, fields), { error: summary }), (suppressedCount ? { suppressedCount, aggregationWindowSeconds: ERROR_WINDOW_MS / 1000 } : {})));
    return summary;
}
function resolveApiAccessOutcome(status, errorCode) {
    if (status < 400)
        return "SUCCESS";
    if (errorCode === "AUTHENTICATION_FAILED" || errorCode === "UNAUTHENTICATED" || status === 401)
        return "AUTHENTICATION_FAILED";
    if (errorCode === "ACCOUNT_DISABLED")
        return "ACCOUNT_DISABLED";
    if (errorCode === "FORBIDDEN" || status === 403)
        return "AUTHORIZATION_DENIED";
    if (errorCode === "VALIDATION_ERROR" || errorCode === "INVALID_JSON" || status === 400)
        return "VALIDATION_FAILED";
    if (errorCode === "DEPENDENCY_UNAVAILABLE" || status === 503)
        return "DEPENDENCY_UNAVAILABLE";
    return "FAILED";
}
function recordApiAccess(fields) {
    writeStructuredLog(fields.status >= 500 ? "error" : fields.status >= 400 ? "warn" : "info", "api.request.completed", fields);
}
