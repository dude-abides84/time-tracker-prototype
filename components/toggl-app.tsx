'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserFrame, type TabChrome } from './browser-frame'
import { JiraBoard } from './jira-board'
import { TogglPanel, type TabTimerState } from './toggl-panel'
import { NewTabPopup } from './new-tab-popup'
import {
  COMPANIES,
  COMPANY_ACME,
  COMPANY_X,
  COMPANY_Y,
  seedEntriesFor,
  type Company,
} from '@/lib/companies'
import { dateKey, type TimeEntry } from '@/lib/toggl-data'

type Tab = {
  id: string
  companyId: string
  timer: TabTimerState
}

function secondsOfDay(d: Date): number {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
}

function makeTimerState(company: Company, running: boolean): TabTimerState {
  const today = dateKey(new Date())
  return {
    description: running ? company.columns[1]?.issues[0]?.title ?? '' : '',
    task: null,
    project: running ? company.project : null,
    tags: [],
    billable: running,
    running,
    elapsed: running ? 47 * 60 + 12 : 0, // Company X already in progress
    entries: seedEntriesFor(company, today),
    date: today,
    view: 'list',
  }
}

export function TogglApp() {
  // Monotonic counter for new tab IDs. Kept in a ref so Fast Refresh / Strict
  // Mode re-running effects can never hand out a duplicate key.
  const tabSeq = useRef(2)
  const nextTabId = useCallback(() => {
    tabSeq.current += 1
    return `tab-${tabSeq.current}`
  }, [])

  // Two tabs open on load: Acme (idle) + Company X (timer in progress).
  const [tabs, setTabs] = useState<Tab[]>(() => [
    {
      id: 'tab-1',
      companyId: COMPANY_ACME.id,
      timer: makeTimerState(COMPANY_ACME, false),
    },
    {
      id: 'tab-2',
      companyId: COMPANY_X.id,
      timer: makeTimerState(COMPANY_X, true),
    },
  ])
  const [activeTabId, setActiveTabId] = useState<string>('tab-2')

  // Extension panel + popup
  const [extensionOpen, setExtensionOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  )
  const activeCompany = COMPANIES[activeTab.companyId]

  // Single global interval advances every running tab's timer independently.
  const anyRunning = tabs.some((t) => t.timer.running)
  useEffect(() => {
    if (!anyRunning) return
    const id = setInterval(() => {
      setTabs((prev) =>
        prev.map((t) =>
          t.timer.running
            ? { ...t, timer: { ...t.timer, elapsed: t.timer.elapsed + 1 } }
            : t,
        ),
      )
    }, 1000)
    return () => clearInterval(id)
  }, [anyRunning])

  const patchTimer = useCallback(
    (tabId: string, partial: Partial<TabTimerState>) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === tabId ? { ...t, timer: { ...t.timer, ...partial } } : t,
        ),
      )
    },
    [],
  )

  const patchActive = useCallback(
    (partial: Partial<TabTimerState>) => patchTimer(activeTabId, partial),
    [patchTimer, activeTabId],
  )

  const toggleTimer = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t
        const timer = t.timer
        if (timer.running) {
          // stop & save
          const now = new Date()
          const end = secondsOfDay(now)
          const start = Math.max(0, end - timer.elapsed)
          const entry: TimeEntry = {
            id: `e${Date.now()}`,
            description: timer.description,
            task: timer.task,
            project: timer.project,
            tags: timer.tags,
            billable: timer.billable,
            date: dateKey(now),
            startSec: start,
            endSec: end,
          }
          return {
            ...t,
            timer: {
              ...timer,
              running: false,
              elapsed: 0,
              description: '',
              task: null,
              project: null,
              tags: [],
              billable: false,
              entries: [entry, ...timer.entries],
            },
          }
        }
        return { ...t, timer: { ...timer, running: true, elapsed: 0 } }
      }),
    )
  }, [activeTabId])

  const updateEntry = useCallback(
    (next: TimeEntry) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                timer: {
                  ...t.timer,
                  entries: t.timer.entries.map((e) =>
                    e.id === next.id ? next : e,
                  ),
                },
              }
            : t,
        ),
      )
    },
    [activeTabId],
  )

  const deleteEntry = useCallback(
    (id: string) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                timer: {
                  ...t.timer,
                  entries: t.timer.entries.filter((e) => e.id !== id),
                },
              }
            : t,
        ),
      )
    },
    [activeTabId],
  )

  /** Build chrome for the tab strip. */
  const tabChrome: TabChrome[] = tabs.map((t) => {
    const c = COMPANIES[t.companyId]
    return {
      id: t.id,
      title: `${c.name} — Jira`,
      favicon: c.accent,
      url: `https://${c.code.toLowerCase()}.atlassian.net/jira/software/projects/${c.code}/board`,
      timerRunning: t.timer.running,
    }
  })

  /**
   * Opening a new tab: pick the next company not already open.
   * Company Y is the primary "third tab". Falls back to any remaining company.
   */
  const openNewTab = useCallback(() => {
    const openIds = new Set(tabs.map((t) => t.companyId))
    const order = [COMPANY_Y, COMPANY_X, COMPANY_ACME]
    const pick = order.find((c) => !openIds.has(c.id)) ?? COMPANY_Y

    const newTab: Tab = {
      id: nextTabId(),
      companyId: pick.id,
      timer: makeTimerState(pick, false),
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)

    // Per spec: a brand-new (never-before-open) tab shows the continue / start popup.
    // If we re-open a company whose tab was closed, it also counts as new → popup.
    setPopupOpen(true)
  }, [tabs, nextTabId])

  const selectTab = useCallback((id: string) => {
    setActiveTabId(id)
    // Switching to an existing tab must NOT show the popup — it silently
    // reverts to that tab's remembered project (already stored in tab.timer).
    setPopupOpen(false)
  }, [])

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev
        const idx = prev.findIndex((t) => t.id === id)
        const next = prev.filter((t) => t.id !== id)
        if (id === activeTabId) {
          const fallback = next[Math.max(0, idx - 1)]
          setActiveTabId(fallback.id)
        }
        return next
      })
    },
    [activeTabId],
  )

  // The popup only relates to the active tab's running timer.
  const showBadge = activeTab.timer.running && !extensionOpen

  return (
    <div className="min-h-screen bg-neutral-300/60 p-4">
      <BrowserFrame
        tabs={tabChrome}
        activeTabId={activeTabId}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
        onNewTab={openNewTab}
        onToggleExtension={() => {
          setExtensionOpen((v) => !v)
          setPopupOpen(false)
        }}
        extensionActive={extensionOpen}
        extensionBadge={showBadge}
        overlay={
          <>
            {/* Extension panel slides in from the right, anchored under the toolbar icon. */}
            {extensionOpen && (
              <div className="absolute right-3 top-3 z-50 h-[calc(100%-1.5rem)] w-[560px] max-w-[calc(100%-1.5rem)] overflow-hidden rounded-[14px] border border-border bg-background shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)]">
                <TogglPanel
                  companyName={activeCompany.name}
                  state={activeTab.timer}
                  patch={patchActive}
                  onToggle={toggleTimer}
                  onUpdateEntry={updateEntry}
                  onDeleteEntry={deleteEntry}
                  onClose={() => setExtensionOpen(false)}
                />
              </div>
            )}

            <NewTabPopup
              open={popupOpen && !extensionOpen}
              running={activeTab.timer.running}
              elapsed={activeTab.timer.elapsed}
              projectName={activeTab.timer.project?.name ?? activeCompany.project.name}
              description={activeTab.timer.description}
              onContinue={() => setPopupOpen(false)}
              onTimeout={() => setPopupOpen(false)}
              onStartNew={() => {
                setPopupOpen(false)
                setExtensionOpen(true)
                requestAnimationFrame(() => {
                  const el = document.querySelector<HTMLInputElement>(
                    'input[aria-label="What are you working on?"]',
                  )
                  el?.focus()
                })
              }}
            />
          </>
        }
      >
        <JiraBoard company={activeCompany} />
      </BrowserFrame>
    </div>
  )
}
