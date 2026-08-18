'use client'

import { useEffect, useRef, useState } from 'react'
import { DollarSign, Folder, ListTree, Trash2 } from 'lucide-react'
import { Dropdown, DropdownItem } from './dropdown'
import {
  formatClock,
  formatDuration,
  parseClock,
  PROJECT_OPTIONS,
  TASK_OPTIONS,
  type Project,
  type TimeEntry,
} from '@/lib/toggl-data'

type TimeEntryCardProps = {
  entry: TimeEntry
  onChange: (entry: TimeEntry) => void
  onDelete: (id: string) => void
}

const entryChip =
  'flex items-center gap-2 rounded-[10px] border border-border bg-card px-3 h-[40px] text-[19px] transition-colors hover:border-foreground/25'

function TimeField({
  value,
  onCommit,
}: {
  value: number
  onCommit: (sec: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="w-[92px] rounded-md border border-brand/40 bg-card px-1 text-center text-[24px] text-foreground/70 focus:outline-none"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(formatClock(value))
        setEditing(true)
      }}
      className="rounded-md px-1 text-[24px] text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
    >
      {formatClock(value)}
    </button>
  )

  function commit() {
    const parsed = parseClock(draft)
    if (parsed !== null) onCommit(parsed)
    setEditing(false)
  }
}

export function TimeEntryCard({ entry, onChange, onDelete }: TimeEntryCardProps) {
  const duration = Math.max(0, entry.endSec - entry.startSec)

  return (
    <section className="group rounded-[15px] border border-border bg-card px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <input
          value={entry.description}
          onChange={(e) => onChange({ ...entry, description: e.target.value })}
          placeholder="Add description"
          aria-label="Entry description"
          className="min-w-0 flex-1 truncate bg-transparent text-[28px] text-card-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex items-center gap-3 pt-1">
          <span className="whitespace-nowrap text-[24px] font-semibold text-card-foreground">
            {formatDuration(duration)}
          </span>
          <button
            type="button"
            aria-label="Delete entry"
            onClick={() => onDelete(entry.id)}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {/* Task */}
          <Dropdown
            trigger={
              <span
                className={`${entryChip} ${entry.task ? 'text-foreground' : 'text-foreground/55'}`}
              >
                <ListTree className="h-[18px] w-[18px] opacity-70" />
                <span className="max-w-[92px] truncate">
                  {entry.task ?? 'Task'}
                </span>
              </span>
            }
          >
            {(close) => (
              <>
                {TASK_OPTIONS.map((t) => (
                  <DropdownItem
                    key={t}
                    active={t === entry.task}
                    onSelect={() => {
                      onChange({ ...entry, task: t === entry.task ? null : t })
                      close()
                    }}
                  >
                    <ListTree className="h-4 w-4 opacity-60" />
                    {t}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>

          {/* Project */}
          {(entry.project || true) && (
            <Dropdown
              trigger={
                <span
                  className={entryChip}
                  style={
                    entry.project ? { color: entry.project.color } : undefined
                  }
                >
                  <Folder
                    className="h-[18px] w-[18px]"
                    style={
                      entry.project
                        ? { color: entry.project.color }
                        : { opacity: 0.6 }
                    }
                  />
                  {entry.project && (
                    <span className="max-w-[120px] truncate">
                      {entry.project.name}
                    </span>
                  )}
                </span>
              }
            >
              {(close) => (
                <>
                  {PROJECT_OPTIONS.map((p: Project) => (
                    <DropdownItem
                      key={p.name}
                      active={p.name === entry.project?.name}
                      onSelect={() => {
                        onChange({
                          ...entry,
                          project:
                            p.name === entry.project?.name ? null : p,
                        })
                        close()
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>
          )}

          {/* Billable */}
          <button
            type="button"
            aria-label="Toggle billable"
            aria-pressed={entry.billable}
            onClick={() => onChange({ ...entry, billable: !entry.billable })}
            className={`flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-border ${
              entry.billable ? 'text-brand' : 'text-foreground/40'
            }`}
          >
            <DollarSign className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-1 whitespace-nowrap">
          <TimeField
            value={entry.startSec}
            onCommit={(sec) => onChange({ ...entry, startSec: sec })}
          />
          <span className="text-[24px] text-foreground/40">–</span>
          <TimeField
            value={entry.endSec}
            onCommit={(sec) => onChange({ ...entry, endSec: sec })}
          />
        </div>
      </div>
    </section>
  )
}
