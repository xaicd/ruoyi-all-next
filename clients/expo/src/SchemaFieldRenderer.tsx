import React from "react"
import { View, Text, TextInput, Switch, StyleSheet } from "react-native"
import type { FieldDef } from "./shared/api"

/**
 * Schema 驱动渲染器（Expo/RN 版）—— 与 Web(portal) 端消费同一份端无关「页面 Schema」，
 * 各自渲染：Web 用 DOM 组件，Expo 用 RN 组件。后台加字段 → 移动端也自动多出一项，无需改代码。
 */

export function SchemaDetailView({ fields, values, brand }: { fields: FieldDef[]; values: Record<string, unknown>; brand?: string }) {
  const shown = fields.filter((f) => f.showInList !== false).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  if (shown.length === 0) return null
  return (
    <View>
      {shown.map((f) => (
        <View key={f.code} style={styles.row}>
          <Text style={styles.label}>{f.label}</Text>
          <Text style={styles.value}>{formatValue(f, values[f.code])}</Text>
        </View>
      ))}
    </View>
  )
}

export function SchemaForm({
  fields,
  values,
  onChange,
  brand = "#4f46e5",
}: {
  fields: FieldDef[]
  values: Record<string, unknown>
  onChange: (code: string, value: unknown) => void
  brand?: string
}) {
  const shown = fields.filter((f) => f.showInForm !== false).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  return (
    <View>
      {shown.map((f) => (
        <View key={f.code} style={styles.field}>
          <Text style={styles.fieldLabel}>
            {f.label}
            {f.required ? <Text style={{ color: "#ef4444" }}> *</Text> : null}
          </Text>
          <FieldInput field={f} value={values[f.code]} onChange={(v) => onChange(f.code, v)} brand={brand} />
        </View>
      ))}
    </View>
  )
}

function formatValue(f: FieldDef, v: unknown): string {
  if (v === undefined || v === null || v === "") return "—"
  if (f.type === "boolean") return v ? "是" : "否"
  if (f.type === "select") return f.options?.find((o) => o.value === String(v))?.label ?? String(v)
  return String(v)
}

function FieldInput({ field, value, onChange, brand }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; brand: string }) {
  if (field.type === "boolean") {
    return <Switch value={Boolean(value)} onValueChange={onChange} trackColor={{ true: brand }} />
  }
  const keyboardType = field.type === "number" ? "numeric" : "default"
  const multiline = field.type === "textarea"
  return (
    <TextInput
      style={[styles.input, multiline && styles.textarea]}
      value={value === undefined || value === null ? "" : String(value)}
      placeholder={field.placeholder}
      placeholderTextColor="#9ca3af"
      keyboardType={keyboardType as any}
      multiline={multiline}
      onChangeText={(t) => onChange(field.type === "number" ? (t === "" ? "" : Number(t)) : t)}
    />
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e5e7eb" },
  label: { color: "#6b7280", fontSize: 13 },
  value: { color: "#111827", fontSize: 13, fontWeight: "500" },
  field: { marginBottom: 12 },
  fieldLabel: { color: "#6b7280", fontSize: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: "#111827" },
  textarea: { height: 72, textAlignVertical: "top" },
})
