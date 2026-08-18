'use client'

import { formatClock, formatDuration, type TimeEntry } from '@/lib/toggl-data'

type CalendarViewProps = {
  entries: TimeEntry[]
}

const START_HOUR = 8
const END_HOUR = 20
const PX_PER_HOUR = 56

export function CalendarView({ entries }: CalendarViewProps) {
  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i,
  )
  const totalHeight = (END_HOUR - START_HOUR) * PX_PER_HOUR

  return (
    <section className="rounded-[15px] border border-border bg-card px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="relative" style={{ height: totalHeight }}>
        {hours.map((h, i) => (
          <div
            key={h}
            className="absolute left-0 right-0 flex items-start gap-3"
            style={{ top: i * PX_PER_HOUR }}
          >
            <span className="w-16 -translate-y-2 text-right text-[13px] tabular-nums text-muted-foreground">
              {formatClock(h * 3600)}
            </span>
            <span className="mt-[1px] h-px flex-1 bg-border" />
          </div>
        ))}

        <div className="absolute bottom-0 left-[76px] right-2 top-0">
          {entries.map((e) => {
            const startH = e.startSec / 3600
            const durH = Math.max(0.25, (e.endSec - e.startSec) / 3600)
            const top = (startH - START_HOUR) * PX_PER_HOUR
            const height = Math.max(20, durH * PX_PER_HOUR)
            const color = e.project?.color ?? '#9f2ba0'
            if (startH < START_HOUR || startH > END_HOUR) return null
            return (
              <div
                key={e.id}
                className="absolute left-0 right-0 overflow-hidden rounded-[8px] px-3 py-1.5"
                style={{
                  top,
                  height,
                  backgroundColor: `${color}1a`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <p className="truncate text-[14px] font-medium text-card-foreground">
                  {e.description || 'Add description'}
                </p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {formatDuration(e.endSec - e.startSec)} ·{' '}
                  {e.project?.name ?? 'No project'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
