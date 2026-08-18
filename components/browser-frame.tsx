'use client'

import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Plus,
  Puzzle,
  RotateCw,
} from 'lucide-react'

type BrowserFrameProps = {
  children: ReactNode
  popup: ReactNode
  onNewTab: () => void
}

export function BrowserFrame({ children, popup, onNewTab }: BrowserFrameProps) {
  return (
    <div className="min-h-screen bg-neutral-200 p-0 md:p-6">
      <div className="mx-auto flex min-h-screen max-w-[1180px] flex-col overflow-hidden rounded-none bg-page shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)] md:min-h-0 md:rounded-[14px]">
        {/* tab strip */}
        <div className="flex items-center gap-2 bg-neutral-300/70 px-3 pt-2.5">
          <div className="flex items-center gap-1.5 pr-1">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex max-w-[240px] flex-1 items-center gap-2 rounded-t-[10px] bg-page px-3.5 py-2 text-[13px] font-medium text-foreground/80">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-primary-foreground">
              t
            </span>
            <span className="truncate">toggl 2.0 — New Tab</span>
          </div>
          <button
            type="button"
            aria-label="Open new tab"
            onClick={onNewTab}
            className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-page/70 hover:text-foreground"
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* toolbar */}
        <div className="relative flex items-center gap-3 border-b border-border bg-page px-4 py-2">
          <div className="flex items-center gap-1 text-foreground/45">
            <ArrowLeft className="h-[18px] w-[18px]" />
            <ArrowRight className="h-[18px] w-[18px]" />
            <RotateCw className="ml-1 h-[16px] w-[16px]" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-200/80 px-4 py-1.5 text-[13px] text-foreground/60">
            <Lock className="h-3.5 w-3.5" />
            <span className="truncate">extension://toggl-2.0/newtab.html</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="toggl 2.0 extension"
              onClick={onNewTab}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-neutral-200"
            >
              <Puzzle className="h-[18px] w-[18px]" />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-[11px] font-semibold text-foreground/70">
              JA
            </span>
          </div>

          {/* extension popup anchors under the toolbar icons */}
          {popup}
        </div>

        {/* page content */}
        <div className="flex-1 bg-page">{children}</div>
      </div>
    </div>
  )
}
