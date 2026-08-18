'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TopNav } from './top-nav'
import { TimerCard } from './timer-card'
import { DateToolbar } from './date-toolbar'
import { TimeEntryCard } from './time-entry-card'
import { CalendarView } from './calendar-view'
import { BrowserFrame } from './browser-frame'
import { NewTabPopup } from './new-tab-popup'
import {
  dateKey,
  makeInitialEntries,
  startOfWeek,
  type Project,
  type TimeEntry,
} from '@/lib/toggl-data'

function secondsOfDay(d: Date): number {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
}

export function TogglApp() {
  const today = useMemo(() => new Date(), [])
  const [entries, setEntries] = useState<TimeEntry[]>(() =>
    makeInitialEntries(dateKey(today)),
  )

  // timer draft
  const [description, setDescription] = useState('')
  const [task, setTask] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [billable, setBillable] = useState(false)

  // timer runtime
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // view
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<'list' | 'calendar'>('list')

  // popup
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const selectedKey = dateKey(date)
  const dayEntries = useMemo(
    () =>
      entries
        .filter((e) => e.date === selectedKey)
        .sort((a, b) => b.startSec - a.startSec),
    [entries, selectedKey],
  )

  const isToday = selectedKey === dateKey(today)

  const dayTotal = useMemo(() => {
    const base = dayEntries.reduce(
      (sum, e) => sum + Math.max(0, e.endSec - e.startSec),
      0,
    )
    return base + (running && isToday ? elapsed : 0)
  }, [dayEntries, running, isToday, elapsed])

  const weekTotal = useMemo(() => {
    const ws = startOfWeek(date)
    const keys = new Set<string>()
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws)
      d.setDate(ws.getDate() + i)
      keys.add(dateKey(d))
    }
    const base = entries
      .filter((e) => keys.has(e.date))
      .reduce((sum, e) => sum + Math.max(0, e.endSec - e.startSec), 0)
    const wsToday = startOfWeek(today)
    const sameWeek = dateKey(startOfWeek(date)) === dateKey(wsToday)
    return base + (running && sameWeek ? elapsed : 0)
  }, [entries, date, running, elapsed, today])

  const stopAndSave = useCallback(() => {
    const now = new Date()
    const end = secondsOfDay(now)
    const start = Math.max(0, end - elapsed)
    const entry: TimeEntry = {
      id: `e${Date.now()}`,
      description,
      task,
      project,
      tags,
      billable,
      date: dateKey(now),
      startSec: start,
      endSec: end,
    }
    setEntries((prev) => [entry, ...prev])
    setRunning(false)
    setElapsed(0)
    setDescription('')
    setTask(null)
    setProject(null)
    setTags([])
    setBillable(false)
  }, [description, task, project, tags, billable, elapsed])

  const onToggle = useCallback(() => {
    if (running) {
      stopAndSave()
    } else {
      setElapsed(0)
      setRunning(true)
    }
  }, [running, stopAndSave])

  const updateEntry = useCallback((next: TimeEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === next.id ? next : e)))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const openNewTab = useCallback(() => {
    setPopupOpen(true)
  }, [])

  // Simulate the extension popup appearing on first new-tab load.
  useEffect(() => {
    const t = setTimeout(() => setPopupOpen(true), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <BrowserFrame
      onNewTab={openNewTab}
      popup={
        <NewTabPopup
          open={popupOpen}
          running={running}
          elapsed={elapsed}
          projectName={project?.name ?? null}
          description={description}
          onContinue={() => setPopupOpen(false)}
          onTimeout={() => setPopupOpen(false)}
          onStartNew={() => {
            setPopupOpen(false)
            if (running) stopAndSave()
            setView('list')
            requestAnimationFrame(() => {
              const el = document.querySelector<HTMLInputElement>(
                'input[aria-label="What are you working on?"]',
              )
              el?.focus()
            })
          }}
        />
      }
    >
      <TopNav />

      <main className="mx-auto w-full max-w-[894px] px-[30px] pb-24 pt-6">
        <TimerCard
          description={description}
          onDescriptionChange={setDescription}
          task={task}
          onTaskChange={setTask}
          project={project}
          onProjectChange={setProject}
          tags={tags}
          onTagsChange={setTags}
          billable={billable}
          onBillableChange={setBillable}
          elapsed={elapsed}
          running={running}
          onToggle={onToggle}
        />

        <div className="mt-9">
          <DateToolbar
            date={date}
            onPrev={() =>
              setDate((d) => {
                const n = new Date(d)
                n.setDate(d.getDate() - 1)
                return n
              })
            }
            onNext={() =>
              setDate((d) => {
                const n = new Date(d)
                n.setDate(d.getDate() + 1)
                return n
              })
            }
            onToday={() => setDate(new Date())}
            dayTotal={dayTotal}
            weekTotal={weekTotal}
            view={view}
            onViewChange={setView}
          />
        </div>

        {view === 'list' ? (
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
                  onChange={updateEntry}
                  onDelete={deleteEntry}
                />
              ))
            )}
          </div>
        ) : (
          <div className="mt-4">
            <CalendarView entries={dayEntries} />
          </div>
        )}
      </main>
    </BrowserFrame>
  )
}
