'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Plus, X } from 'lucide-react'
import { formatStopwatch } from '@/lib/toggl-data'

type NewTabPopupProps = {
  open: boolean
  /** whether ANY timer is running across all tabs (something to continue) */
  anyRunning: boolean
  elapsed: number
  projectName: string | null
  description: string
  /** keep tracking the current project and dismiss */
  onContinue: () => void
  /** open the full extension to start a new project */
  onStartNew: () => void
  /** fired when the 5s idle timeout elapses */
  onTimeout: () => void
}

const AUTO_CLOSE_MS = 5000

export function NewTabPopup({
  open,
  anyRunning,
  elapsed,
  projectName,
  description,
  onContinue,
  onStartNew,
  onTimeout,
}: NewTabPopupProps) {
  const [remaining, setRemaining] = useState(AUTO_CLOSE_MS)
  const timeoutRef = useRef(onTimeout)
  timeoutRef.current = onTimeout

  useEffect(() => {
    if (!open) return
    setRemaining(AUTO_CLOSE_MS)
    const started = Date.now()
    const tick = setInterval(() => {
      const left = AUTO_CLOSE_MS - (Date.now() - started)
      setRemaining(Math.max(0, left))
    }, 50)
    const timer = setTimeout(() => timeoutRef.current(), AUTO_CLOSE_MS)
    return () => {
      clearInterval(tick)
      clearTimeout(timer)
    }
  }, [open])

  if (!open) return null

  const pct = (remaining / AUTO_CLOSE_MS) * 100
  const seconds = Math.ceil(remaining / 1000)

  return (
    <div className="absolute right-4 top-2 z-[60] w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
      {/* pointer to the extension icon */}
      <div className="ml-auto mr-6 h-3 w-3 translate-y-1.5 rotate-45 rounded-[2px] border-l border-t border-border bg-card" />
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-baseline gap-1 font-logo font-extrabold">
            <span className="text-[18px] text-brand">toggl</span>
            <span className="text-[15px] text-brand/55">2.0</span>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onContinue}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-[15px] font-medium text-card-foreground">
            {anyRunning ? 'A timer is running' : 'No timer running'}
          </p>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {anyRunning
              ? `${projectName ?? 'No project'}${
                  description ? ` · ${description}` : ''
                } · ${formatStopwatch(elapsed)}`
              : 'Start tracking a new project to begin.'}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {anyRunning && (
              <button
                type="button"
                onClick={onContinue}
                className="flex items-center justify-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-[15px] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-current" />
                Continue timer
              </button>
            )}
            <button
              type="button"
              onClick={onStartNew}
              className={
                anyRunning
                  ? 'flex items-center justify-center gap-2 rounded-[10px] border border-border px-4 py-2.5 text-[15px] font-semibold text-card-foreground transition-colors hover:bg-muted'
                  : 'flex items-center justify-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-[15px] font-semibold text-primary-foreground transition-transform active:scale-[0.98]'
              }
            >
              <Plus className="h-4 w-4" />
              Start new project
            </button>
          </div>

          <div className="mt-4">
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-brand/40 transition-[width] duration-75 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-[12px] text-muted-foreground">
              {anyRunning
                ? `Continuing current timer in ${seconds}s`
                : `Dismissing in ${seconds}s`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
