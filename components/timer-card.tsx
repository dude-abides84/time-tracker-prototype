'use client'

import { DollarSign, Folder, ListTree, Pause, Play, Tag } from 'lucide-react'
import { Dropdown, DropdownItem } from './dropdown'
import {
  formatStopwatch,
  PROJECT_OPTIONS,
  TAG_OPTIONS,
  TASK_OPTIONS,
  type Project,
} from '@/lib/toggl-data'

type TimerCardProps = {
  description: string
  onDescriptionChange: (v: string) => void
  task: string | null
  onTaskChange: (v: string | null) => void
  project: Project | null
  onProjectChange: (v: Project | null) => void
  tags: string[]
  onTagsChange: (v: string[]) => void
  billable: boolean
  onBillableChange: (v: boolean) => void
  elapsed: number
  running: boolean
  onToggle: () => void
}

const chipBase =
  'flex items-center gap-2 rounded-[12px] border border-dashed border-border px-3.5 h-[42px] text-[16px] transition-colors hover:border-foreground/30'

export function TimerCard(props: TimerCardProps) {
  const {
    description,
    onDescriptionChange,
    task,
    onTaskChange,
    project,
    onProjectChange,
    tags,
    onTagsChange,
    billable,
    onBillableChange,
    elapsed,
    running,
    onToggle,
  } = props

  return (
    <section className="rounded-[15px] border border-border bg-card px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="What are you working on?"
        aria-label="What are you working on?"
        className="w-full bg-transparent text-[28px] font-medium text-foreground/85 placeholder:text-foreground/70 focus:outline-none"
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Task */}
          <Dropdown
            trigger={
              <span
                className={`${chipBase} ${task ? 'border-solid text-foreground' : 'text-foreground/55'}`}
              >
                <ListTree className="h-[18px] w-[18px] opacity-70" />
                <span className="max-w-[120px] truncate">{task ?? 'Task'}</span>
              </span>
            }
          >
            {(close) => (
              <>
                {TASK_OPTIONS.map((t) => (
                  <DropdownItem
                    key={t}
                    active={t === task}
                    onSelect={() => {
                      onTaskChange(t === task ? null : t)
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
          <Dropdown
            trigger={
              <span
                className={`${chipBase} ${project ? 'border-solid' : 'text-foreground/55'}`}
                style={project ? { color: project.color } : undefined}
              >
                <Folder
                  className="h-[18px] w-[18px]"
                  style={project ? { color: project.color } : undefined}
                />
                <span className="max-w-[140px] truncate">
                  {project?.name ?? 'Project'}
                </span>
              </span>
            }
          >
            {(close) => (
              <>
                {PROJECT_OPTIONS.map((p) => (
                  <DropdownItem
                    key={p.name}
                    active={p.name === project?.name}
                    onSelect={() => {
                      onProjectChange(p.name === project?.name ? null : p)
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

          {/* Tags */}
          <Dropdown
            trigger={
              <span
                className={`${chipBase} ${tags.length ? 'border-solid text-foreground' : 'text-foreground/55'}`}
              >
                <Tag className="h-[18px] w-[18px] opacity-70" />
                <span className="max-w-[120px] truncate">
                  {tags.length ? tags.join(', ') : 'Tags'}
                </span>
              </span>
            }
          >
            {(close) => (
              <>
                {TAG_OPTIONS.map((t) => {
                  const active = tags.includes(t)
                  return (
                    <DropdownItem
                      key={t}
                      active={active}
                      onSelect={() =>
                        onTagsChange(
                          active
                            ? tags.filter((x) => x !== t)
                            : [...tags, t],
                        )
                      }
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          active
                            ? 'border-brand bg-brand text-primary-foreground'
                            : 'border-border'
                        }`}
                      >
                        {active ? '✓' : ''}
                      </span>
                      {t}
                    </DropdownItem>
                  )
                })}
                <button
                  type="button"
                  onClick={close}
                  className="mt-1 w-full border-t border-border px-3.5 py-2 text-left text-[14px] font-medium text-brand"
                >
                  Done
                </button>
              </>
            )}
          </Dropdown>

          {/* Billable */}
          <button
            type="button"
            aria-pressed={billable}
            aria-label="Toggle billable"
            onClick={() => onBillableChange(!billable)}
            className={`flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border ${
              billable
                ? 'border-solid border-brand/40 bg-brand-soft text-brand'
                : 'border-dashed border-border text-foreground/55 hover:border-foreground/30'
            }`}
          >
            <DollarSign className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <span className="min-w-[120px] text-right font-mono text-[27px] tabular-nums text-foreground/45">
            {formatStopwatch(elapsed)}
          </span>

          <button
            type="button"
            onClick={onToggle}
            aria-label={running ? 'Stop timer' : 'Start timer'}
            className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-brand-ring transition-transform active:scale-95"
          >
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand text-primary-foreground shadow-[0_4px_10px_-2px_rgba(159,43,160,0.5)]">
              {running ? (
                <Pause className="h-7 w-7 fill-current" />
              ) : (
                <Play className="ml-1 h-7 w-7 fill-current" />
              )}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
