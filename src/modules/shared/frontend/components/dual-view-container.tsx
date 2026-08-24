"use client"

import React, { ReactNode } from "react"
import { ViewMode } from "./view-mode-switcher"

export interface DualViewContainerProps {
  viewMode: ViewMode
  tableView: ReactNode
  cardView: ReactNode
}

/**
 * 通用双模视图容器 (自动按 viewMode 渲染列表或卡片网格)
 */
export function DualViewContainer({
  viewMode,
  tableView,
  cardView,
}: DualViewContainerProps) {
  return (
    <div className="w-full transition-all duration-150">
      {viewMode === "table" ? tableView : cardView}
    </div>
  )
}

export default DualViewContainer
