'use client'

import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react'
import { Dropdown, DropdownItem } from './dropdown'
import { formatDuration } from '@/lib/toggl-data'

type View = 'list' | 'calendar'

type DateToolbarProps = {
  date: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  dayTotal: number
  weekTotal: number
  view: View
  onViewChange: (v: View) => void
}

function relativeLabel(date: Date): string {
  const today = new Date()
  const a = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.round((a.getTime() - b.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === -1) return 'Yesterday'
  if (diff === 1) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function DateToolbar({
  date,
  onPrev,
  onNext,
  onToday,
  dayTotal,
  weekTotal,
  view,
  onViewChange,
}: DateToolbarProps) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })

  return (
    <div className="flex items-center gap-5 px-1 py-1">
      <div className="flex items-center gap-3 text-foreground/80">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous day"
          className="transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next day"
          className="transition-colors hover:text-foreground"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <button
        type="button"
        onClick={onToday}
        className="text-[26px] font-bold text-foreground"
      >
        {relativeLabel(date)}
      </button>

      <Dropdown
        trigger={
          <div className="flex items-center gap-2 text-foreground/60">
            <span className="max-w-[56px] text-[19px] leading-[1.1]">
              {weekday} {day} {month}
            </span>
            <ChevronDown className="h-5 w-5" />
          </div>
        }
      >
        {(close) => (
          <>
            <DropdownItem
              onSelect={() => {
                onToday()
                close()
              }}
            >
              Today
            </DropdownItem>
            <DropdownItem
              onSelect={() => {
                onPrev()
                close()
              }}
            >
              Previous day
            </DropdownItem>
            <DropdownItem
              onSelect={() => {
                onNext()
                close()
              }}
            >
              Next day
            </DropdownItem>
          </>
        )}
      </Dropdown>

      <div className="flex items-center gap-2.5 text-[24px]">
        <span className="text-foreground/55">Day</span>
        <span className="font-semibold text-foreground">
          {formatDuration(dayTotal)}
        </span>
      </div>

      <span className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2.5 text-[24px]">
        <span className="text-foreground/55">Week</span>
        <span className="font-semibold text-foreground">
          {formatDuration(weekTotal)}
        </span>
      </div>

      <div className="ml-auto flex items-center overflow-hidden rounded-[10px] border border-border">
        <button
          type="button"
          aria-label="List view"
          aria-pressed={view === 'list'}
          onClick={() => onViewChange('list')}
          className={`flex h-[42px] w-[46px] items-center justify-center ${
            view === 'list'
              ? 'bg-brand-soft text-brand'
              : 'bg-card text-foreground/50 hover:text-foreground'
          }`}
        >
          <List className="h-[22px] w-[22px]" />
        </button>
        <span className="h-[42px] w-px bg-border" />
        <button
          type="button"
          aria-label="Calendar view"
          aria-pressed={view === 'calendar'}
          onClick={() => onViewChange('calendar')}
          className={`flex h-[42px] w-[46px] items-center justify-center ${
            view === 'calendar'
              ? 'bg-brand-soft text-brand'
              : 'bg-card text-foreground/50 hover:text-foreground'
          }`}
        >
          <CalendarIcon className="h-[21px] w-[21px]" />
        </button>
      </div>
    </div>
  )
}
