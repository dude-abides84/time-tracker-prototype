'use client'

import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Plus,
  Puzzle,
  RotateCw,
  X,
} from 'lucide-react'

export type TabChrome = {
  id: string
  title: string
  favicon: string // hex color for the dot
  url: string
  timerRunning: boolean
}

type BrowserFrameProps = {
  tabs: TabChrome[]
  activeTabId: string
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onNewTab: () => void
  /** toolbar extension icon */
  onToggleExtension: () => void
  extensionActive: boolean
  extensionBadge: boolean
  /** page content for the active tab */
  children: ReactNode
  /** floating popup + extension panel layer */
  overlay?: ReactNode
}

export function BrowserFrame({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onToggleExtension,
  extensionActive,
  extensionBadge,
  children,
  overlay,
}: BrowserFrameProps) {
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1400px] flex-col overflow-hidden rounded-[12px] border border-black/10 bg-[#dee1e6] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]">
      {/* Tab strip */}
      <div className="flex items-end gap-1 px-3 pt-2">
        {tabs.map((tab) => {
          const active = tab.id === activeTabId
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex h-9 w-[220px] shrink-0 cursor-pointer items-center gap-2 rounded-t-[10px] px-3 text-[13px] transition-colors ${
                active
                  ? 'bg-[#f7f7f7] text-foreground'
                  : 'bg-[#c9ccd1] text-foreground/70 hover:bg-[#d4d7db]'
              }`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: tab.favicon }}
              />
              <span className="min-w-0 flex-1 truncate">{tab.title}</span>
              {tab.timerRunning && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-brand"
                  title="Timer running"
                />
              )}
              {tabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`Close ${tab.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseTab(tab.id)
                  }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground/50 opacity-0 transition-opacity hover:bg-black/10 hover:text-foreground group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )
        })}
        <button
          type="button"
          aria-label="Open a new tab"
          onClick={onNewTab}
          className="mb-1 flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-black/10 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-[#f7f7f7] px-4 py-2">
        <div className="flex items-center gap-1 text-foreground/50">
          <ArrowLeft className="h-[18px] w-[18px]" />
          <ArrowRight className="h-[18px] w-[18px]" />
          <RotateCw className="h-4 w-4" />
        </div>
        <div className="flex h-8 flex-1 items-center gap-2 rounded-full bg-white px-3 text-[13px] text-foreground/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <Lock className="h-3.5 w-3.5 text-foreground/40" />
          <span className="truncate">{activeTab?.url}</span>
        </div>
        <button
          type="button"
          aria-label="Toggl 2.0 extension"
          aria-pressed={extensionActive}
          onClick={onToggleExtension}
          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            extensionActive
              ? 'bg-brand-soft text-brand'
              : 'text-foreground/60 hover:bg-black/5'
          }`}
        >
          <Puzzle className="h-[18px] w-[18px]" />
          {extensionBadge && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#f7f7f7] bg-brand" />
          )}
        </button>
      </div>

      {/* Viewport */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
        {children}
        {overlay}
      </div>
    </div>
  )
}
