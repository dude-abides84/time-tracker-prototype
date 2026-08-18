import type { Project, TimeEntry } from '@/lib/toggl-data'
import { PROJECT_OPTIONS, dateKey } from '@/lib/toggl-data'

/** A Jira-style issue shown on a company board. */
export type Issue = {
  key: string
  title: string
  type: 'Story' | 'Bug' | 'Task'
  priority: 'Highest' | 'High' | 'Medium' | 'Low'
  points: number | null
  assignee: string
}

export type BoardColumn = {
  id: string
  name: string
  issues: Issue[]
}

/** A generic company whose Jira board lives in a browser tab. */
export type Company = {
  id: string
  name: string
  /** short code used in the fake address bar + issue keys */
  code: string
  /** accent color for the Jira board chrome */
  accent: string
  /** the Toggl project this company maps to */
  project: Project
  sprint: string
  columns: BoardColumn[]
}

const ACME_PROJECT: Project = { name: 'Acme website revamp', color: '#6554c0' }
const X_PROJECT: Project = { name: 'Company X onboarding', color: '#0052cc' }
const Y_PROJECT: Project = { name: 'Company Y mobile app', color: '#00875a' }

export const COMPANY_ACME: Company = {
  id: 'acme',
  name: 'Acme Corp',
  code: 'ACME',
  accent: '#6554c0',
  project: ACME_PROJECT,
  sprint: 'Sprint 14',
  columns: [
    {
      id: 'todo',
      name: 'To Do',
      issues: [
        {
          key: 'ACME-231',
          title: 'Redesign marketing homepage hero',
          type: 'Story',
          priority: 'High',
          points: 5,
          assignee: 'JA',
        },
        {
          key: 'ACME-238',
          title: 'Audit color contrast across components',
          type: 'Task',
          priority: 'Medium',
          points: 3,
          assignee: 'RK',
        },
      ],
    },
    {
      id: 'inprogress',
      name: 'In Progress',
      issues: [
        {
          key: 'ACME-229',
          title: 'Build reusable pricing table',
          type: 'Story',
          priority: 'High',
          points: 8,
          assignee: 'JA',
        },
      ],
    },
    {
      id: 'review',
      name: 'In Review',
      issues: [
        {
          key: 'ACME-224',
          title: 'Fix nav overlap on tablet breakpoint',
          type: 'Bug',
          priority: 'Highest',
          points: 2,
          assignee: 'ML',
        },
      ],
    },
    {
      id: 'done',
      name: 'Done',
      issues: [
        {
          key: 'ACME-218',
          title: 'Set up analytics events',
          type: 'Task',
          priority: 'Low',
          points: 1,
          assignee: 'RK',
        },
      ],
    },
  ],
}

export const COMPANY_X: Company = {
  id: 'company-x',
  name: 'Company X',
  code: 'CMPX',
  accent: '#0052cc',
  project: X_PROJECT,
  sprint: 'Sprint 6',
  columns: [
    {
      id: 'todo',
      name: 'To Do',
      issues: [
        {
          key: 'CMPX-102',
          title: 'Draft onboarding email sequence',
          type: 'Task',
          priority: 'Medium',
          points: 3,
          assignee: 'JA',
        },
      ],
    },
    {
      id: 'inprogress',
      name: 'In Progress',
      issues: [
        {
          key: 'CMPX-097',
          title: 'Implement account setup wizard',
          type: 'Story',
          priority: 'Highest',
          points: 13,
          assignee: 'JA',
        },
        {
          key: 'CMPX-099',
          title: 'Wire up SSO provider callbacks',
          type: 'Story',
          priority: 'High',
          points: 5,
          assignee: 'TP',
        },
      ],
    },
    {
      id: 'review',
      name: 'In Review',
      issues: [
        {
          key: 'CMPX-094',
          title: 'Validate invite-token expiry logic',
          type: 'Bug',
          priority: 'High',
          points: 3,
          assignee: 'ML',
        },
      ],
    },
    {
      id: 'done',
      name: 'Done',
      issues: [
        {
          key: 'CMPX-088',
          title: 'Provision staging environment',
          type: 'Task',
          priority: 'Medium',
          points: 2,
          assignee: 'TP',
        },
        {
          key: 'CMPX-090',
          title: 'Company X brand kit import',
          type: 'Task',
          priority: 'Low',
          points: 1,
          assignee: 'JA',
        },
      ],
    },
  ],
}

export const COMPANY_Y: Company = {
  id: 'company-y',
  name: 'Company Y',
  code: 'CMPY',
  accent: '#00875a',
  project: Y_PROJECT,
  sprint: 'Sprint 2',
  columns: [
    {
      id: 'todo',
      name: 'To Do',
      issues: [
        {
          key: 'CMPY-045',
          title: 'Spec push-notification permissions flow',
          type: 'Story',
          priority: 'High',
          points: 5,
          assignee: 'JA',
        },
        {
          key: 'CMPY-047',
          title: 'Design empty states for feed',
          type: 'Task',
          priority: 'Medium',
          points: 3,
          assignee: 'SB',
        },
      ],
    },
    {
      id: 'inprogress',
      name: 'In Progress',
      issues: [
        {
          key: 'CMPY-041',
          title: 'Build offline caching layer',
          type: 'Story',
          priority: 'Highest',
          points: 8,
          assignee: 'JA',
        },
      ],
    },
    {
      id: 'review',
      name: 'In Review',
      issues: [],
    },
    {
      id: 'done',
      name: 'Done',
      issues: [
        {
          key: 'CMPY-036',
          title: 'Set up mobile CI pipeline',
          type: 'Task',
          priority: 'Medium',
          points: 3,
          assignee: 'SB',
        },
      ],
    },
  ],
}

export const COMPANIES: Record<string, Company> = {
  acme: COMPANY_ACME,
  'company-x': COMPANY_X,
  'company-y': COMPANY_Y,
}

/** Per-company Toggl project options: the company project first, then the generics. */
export function projectOptionsFor(company: Company): Project[] {
  return [company.project, ...PROJECT_OPTIONS]
}

/**
 * Seed time entries for a company's Toggl panel.
 * Company X gets a running/in-progress feel; others start idle with light history.
 */
export function seedEntriesFor(company: Company, today: string): TimeEntry[] {
  if (company.id === 'company-x') {
    return [
      {
        id: `${company.id}-e1`,
        description: 'Implement account setup wizard',
        task: 'CMPX-097',
        project: company.project,
        tags: ['Focus'],
        billable: true,
        date: today,
        startSec: 13 * 3600 + 30 * 60,
        endSec: 14 * 3600 + 20 * 60,
      },
      {
        id: `${company.id}-e2`,
        description: 'Standup + sprint planning',
        task: null,
        project: company.project,
        tags: ['Meeting'],
        billable: false,
        date: today,
        startSec: 9 * 3600,
        endSec: 9 * 3600 + 25 * 60,
      },
    ]
  }
  if (company.id === 'acme') {
    return [
      {
        id: `${company.id}-e1`,
        description: 'Build reusable pricing table',
        task: 'ACME-229',
        project: company.project,
        tags: [],
        billable: true,
        date: today,
        startSec: 11 * 3600,
        endSec: 12 * 3600 + 15 * 60,
      },
    ]
  }
  // Company Y: fresh board, no history yet.
  return []
}

export { dateKey }
