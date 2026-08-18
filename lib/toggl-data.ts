export type Project = {
  name: string
  color: string
}

export type TimeEntry = {
  id: string
  description: string
  task: string | null
  project: Project | null
  tags: string[]
  billable: boolean
  /** YYYY-MM-DD the entry belongs to */
  date: string
  /** seconds from midnight */
  startSec: number
  /** seconds from midnight */
  endSec: number
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export function startOfWeek(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = (copy.getDay() + 6) % 7 // Monday = 0
  copy.setDate(copy.getDate() - day)
  return copy
}

export const TASK_OPTIONS = [
  'New task',
  'Task',
  'Design review',
  'Bug fixes',
  'Skills based assessment',
]

export const PROJECT_OPTIONS: Project[] = [
  { name: "Jamie's test project", color: '#3b82f6' },
  { name: 'Marketing site', color: '#16a34a' },
  { name: 'Internal tools', color: '#f59e0b' },
  { name: 'Client work', color: '#e11d48' },
]

export const TAG_OPTIONS = ['Billable', 'Meeting', 'Focus', 'Research', 'Admin']

/** helpers -------------------------------------------------------------- */

export function formatClock(sec: number): string {
  const s = ((sec % 86400) + 86400) % 86400
  let h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function parseClock(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
  if (!match) return null
  let h = Number.parseInt(match[1], 10)
  const m = Number.parseInt(match[2], 10)
  const ampm = match[3]?.toLowerCase()
  if (m > 59) return null
  if (ampm) {
    if (h < 1 || h > 12) return null
    if (ampm === 'pm' && h !== 12) h += 12
    if (ampm === 'am' && h === 12) h = 0
  } else if (h > 23) {
    return null
  }
  return h * 3600 + m * 60
}

/** compact duration: 5s, 8m, 1h 45m */
export function formatDuration(sec: number): string {
  const total = Math.max(0, Math.round(sec))
  if (total < 60) return `${total}s`
  const minutes = Math.floor(total / 60)
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

/** stopwatch style: 0:00:00 */
export function formatStopwatch(sec: number): string {
  const total = Math.max(0, Math.floor(sec))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function makeInitialEntries(today: string): TimeEntry[] {
  return [
    {
      id: 'e1',
      description: '',
      task: 'New task',
      project: PROJECT_OPTIONS[0],
      tags: [],
      billable: true,
      date: today,
      startSec: 14 * 3600 + 30 * 60, // 2:30 PM
      endSec: 16 * 3600 + 15 * 60, // 4:15 PM
    },
    {
      id: 'e2',
      description: 'Testing whether time stops when the browser closes',
      task: null,
      project: null,
      tags: [],
      billable: true,
      date: today,
      startSec: 14 * 3600 + 30 * 60, // 2:30 PM
      endSec: 14 * 3600 + 30 * 60 + 5, // + 5s
    },
    {
      id: 'e3',
      description: 'Testing whether time stops when the browser closes',
      task: 'New task',
      project: PROJECT_OPTIONS[0],
      tags: [],
      billable: true,
      date: today,
      startSec: 14 * 3600 + 19 * 60 + 40, // 2:19 PM
      endSec: 14 * 3600 + 28 * 60 + 20, // 2:28 PM (8m)
    },
    {
      id: 'e4',
      description: 'Skills based assessment',
      task: 'New task',
      project: PROJECT_OPTIONS[0],
      tags: [],
      billable: true,
      date: today,
      startSec: 14 * 3600 + 12 * 60 + 10, // 2:12 PM
      endSec: 14 * 3600 + 13 * 60 + 20, // 2:13 PM (1m)
    },
  ]
}
