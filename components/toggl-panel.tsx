'use client'

import { useMemo } from 'react'
import { X } from 'lucide-react'
import { TimerCard } from './timer-card'
import { DateToolbar } from './date-toolbar'
import { TimeEntryCard } from './time-entry-card'
import { CalendarView } from './calendar-view'
import {
  dateKey,
  startOfWeek,
  type Project,
  type TimeEntry,
} from '@/lib/toggl-data'

export type TabTimerState = {
  description: string
  task: string | null
  project: Project | null
  tags: string[]
  billable: boolean
  running: boolean
  elapsed: number
  entries: TimeEntry[]
  date: string
  view: 'list' | 'calendar'
}

type TogglPanelProps = {
  companyName: string
  state: TabTimerState
  patch: (partial: Partial<TabTimerState>) => void
  onToggle: () => void
  onUpdateEntry: (entry: TimeEntry) => void
  onDeleteEntry: (id: string) => void
  onClose: () => void
}

export function TogglPanel({
  companyName,
  state,
  patch,
  onToggle,
  onUpdateEntry,
  onDeleteEntry,
  onClose,
}: TogglPanelProps) {
  const date = useMemo(() => new Date(state.date), [state.date])

  const dayEntries = useMemo(
    () =>
      state.entries
        .filter((e) => e.date === state.date)
        .sort((a, b) => b.startSec - a.startSec),
    [state.entries, state.date],
  )

  const dayTotal = useMemo(() => {
    const base = dayEntries.reduce(
      (sum, e) => sum + Math.max(0, e.endSec - e.startSec),
      0,
    )
    return base + (state.running ? state.elapsed : 0)
  }, [dayEntries, state.running, state.elapsed])

  const weekTotal = useMemo(() => {
    const ws = startOfWeek(date)
    const keys = new Set<string>()
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws)
      d.setDate(ws.getDate() + i)
      keys.add(dateKey(d))
    }
    const base = state.entries
      .filter((e) => keys.has(e.date))
      .reduce((sum, e) => sum + Math.max(0, e.endSec - e.startSec), 0)
    return base + (state.running ? state.elapsed : 0)
  }, [state.entries, date, state.running, state.elapsed])

  function shiftDate(days: number) {
    const n = new Date(state.date)
    n.setDate(n.getDate() + days)
    patch({ date: dateKey(n) })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Panel header — nav bar styled to fit the narrow extension */}
      <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-border bg-card px-5">
        <div className="flex items-baseline gap-1.5 font-logo font-extrabold tracking-tight">
          <span className="text-[22px] text-brand">toggl</span>
          <span className="text-[17px] font-bold text-brand/55">2.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="max-w-[150px] truncate rounded-full bg-muted px-3 py-1 text-[12px] font-medium text-foreground/70">
            {companyName}
          </span>
          <button
            type="button"
            aria-label="Close extension"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-8 pt-4">
        <TimerCard
          description={state.description}
          onDescriptionChange={(v) => patch({ description: v })}
          task={state.task}
          onTaskChange={(v) => patch({ task: v })}
          project={state.project}
          onProjectChange={(v) => patch({ project: v })}
          tags={state.tags}
          onTagsChange={(v) => patch({ tags: v })}
          billable={state.billable}
          onBillableChange={(v) => patch({ billable: v })}
          elapsed={state.elapsed}
          running={state.running}
          onToggle={onToggle}
        />

        <div className="mt-7">
          <DateToolbar
            date={date}
            onPrev={() => shiftDate(-1)}
            onNext={() => shiftDate(1)}
            onToday={() => patch({ date: dateKey(new Date()) })}
            dayTotal={dayTotal}
            weekTotal={weekTotal}
            view={state.view}
            onViewChange={(v) => patch({ view: v })}
          />
        </div>

        {state.view === 'list' ? (
          <div className="mt-4 flex flex-col gap-3.5">
            {dayEntries.length === 0 ? (
              <div className="rounded-[15px] border border-dashed border-border bg-card/50 px-6 py-14 text-center text-[18px] text-muted-foreground">
                No time entries for this day.
              </div>
            ) : (
              dayEntries.map((entry) => (
                <TimeEntryCard
                  key={entry.id}
                  entry={entry}
                  onChange={onUpdateEntry}
                  onDelete={onDeleteEntry}
                />
              ))
            )}
          </div>
        ) : (
          <div className="mt-4">
            <CalendarView entries={dayEntries} />
          </div>
        )}
      </div>
    </div>
  )
}
