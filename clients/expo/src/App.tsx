import React, { useEffect, useState } from "react"
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import {
  fetchAppearance,
  fetchPageSchema,
  memberLogin,
  fetchProfile,
  updateProfile,
  DEMO_CREDENTIALS,
  type Appearance,
  type MemberPublic,
  type PageSchema,
} from "./shared/api"
import { SchemaDetailView, SchemaForm } from "./SchemaFieldRenderer"

export default function App() {
  const [appearance, setAppearance] = useState<Appearance | null>(null)
  const [member, setMember] = useState<MemberPublic | null>(null)
  const [schema, setSchema] = useState<PageSchema | null>(null)
  // 预览免输入登录：默认预填演示凭据（对齐 portal），点登录即进
  const [account, setAccount] = useState(DEMO_CREDENTIALS.account)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [error, setError] = useState("")

  const brand = appearance?.primaryColor || "#4f46e5"

  useEffect(() => {
    fetchAppearance().then(setAppearance).catch(() => {})
    fetchPageSchema("member_user").then(setSchema).catch(() => {})
  }, [])

  const doLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const { member: m } = await memberLogin(account, password)
      const full = await fetchProfile().catch(() => m)
      setMember(full)
      setDraft({ ...(full.extraFields ?? {}) })
    } catch (e: any) {
      setError(e?.message || "登录失败")
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    setLoading(true)
    setError("")
    try {
      const updated = await updateProfile({ extraFields: draft })
      setMember(updated)
      setDraft({ ...(updated.extraFields ?? {}) })
      setEditing(false)
    } catch (e: any) {
      setError(e?.message || "保存失败")
    } finally {
      setLoading(false)
    }
  }

  const hasDynamic = (schema?.fields?.length ?? 0) > 0

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: brand }]}>{appearance?.siteName ?? "RuoYi Portal"}</Text>

        {!member ? (
          <View style={styles.card}>
            <Text style={styles.h2}>登录</Text>
            <TextInput style={styles.input} value={account} onChangeText={setAccount} placeholder="账号" placeholderTextColor="#9ca3af" autoCapitalize="none" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="密码" placeholderTextColor="#9ca3af" secureTextEntry />
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <TouchableOpacity style={[styles.btn, { backgroundColor: brand }]} onPress={doLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>登录</Text>}
            </TouchableOpacity>
            <Text style={styles.hint}>演示账号已预填（demo / demo123），点「登录」即可</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.h2}>用户中心</Text>
              <Text style={styles.name}>{member.nickname}</Text>
              <Text style={styles.sub}>账号：{member.account} · 等级：{member.memberLevel}</Text>
            </View>

            {hasDynamic && (
              <View style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.h2}>{schema?.title || "扩展信息"}</Text>
                  {!editing ? (
                    <TouchableOpacity onPress={() => setEditing(true)}><Text style={[styles.link, { color: brand }]}>编辑</Text></TouchableOpacity>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity onPress={() => { setEditing(false); setDraft({ ...(member.extraFields ?? {}) }) }}><Text style={styles.link}>取消</Text></TouchableOpacity>
                      <TouchableOpacity onPress={save}><Text style={[styles.link, { color: brand }]}>{loading ? "保存中…" : "保存"}</Text></TouchableOpacity>
                    </View>
                  )}
                </View>
                {error && editing ? <Text style={styles.err}>{error}</Text> : null}
                {editing ? (
                  <SchemaForm fields={schema!.fields} values={draft} brand={brand} onChange={(c, v) => setDraft((d) => ({ ...d, [c]: v }))} />
                ) : (
                  <SchemaDetailView fields={schema!.fields} values={member.extraFields ?? {}} brand={brand} />
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", marginTop: 12 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb" },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 10, color: "#111827" },
  btn: { borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  hint: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 10 },
  err: { color: "#ef4444", fontSize: 12, marginBottom: 8 },
  link: { fontSize: 14, color: "#6b7280" },
})
