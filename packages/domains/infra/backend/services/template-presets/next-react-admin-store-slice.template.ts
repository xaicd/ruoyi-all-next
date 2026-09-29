export const nextReactAdminStoreSliceTemplate = `"use client"

import { create } from "zustand"

interface {{entityName}}UiState {
  keyword: string
  status: "ALL" | "ACTIVE" | "DISABLED"
  page: number
  pageSize: number
  setKeyword: (keyword: string) => void
  setStatus: (status: "ALL" | "ACTIVE" | "DISABLED") => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  reset: () => void
}

const initialState = {
  keyword: "",
  status: "ALL" as const,
  page: 1,
  pageSize: 20,
}

export const use{{entityName}}UiStore = create<{{entityName}}UiState>((set) => ({
  ...initialState,
  setKeyword: (keyword) => set({ keyword, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set(initialState),
}))
`