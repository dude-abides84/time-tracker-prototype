'use client'

import type { Company, Issue } from '@/lib/companies'
import { Search, Plus, Settings, Bell, HelpCircle } from 'lucide-react'

const TYPE_STYLES: Record<Issue['type'], { bg: string; label: string }> = {
  Story: { bg: '#63ba3c', label: 'S' },
  Bug: { bg: '#e5493a', label: 'B' },
  Task: { bg: '#4bade8', label: 'T' },
}

const PRIORITY_COLOR: Record<Issue['priority'], string> = {
  Highest: '#cd1317',
  High: '#e9494a',
  Medium: '#e97f33',
  Low: '#2d8738',
}

const AVATAR_COLORS: Record<string, string> = {
  JA: '#6554c0',
  RK: '#00857a',
  ML: '#c9372c',
  TP: '#0055cc',
  SB: '#946f00',
}

function IssueCard({ issue }: { issue: Issue }) {
  const type = TYPE_STYLES[issue.type]
  return (
    <div className="rounded-[3px] border border-[#dfe1e6] bg-white p-3 shadow-[0_1px_2px_rgba(9,30,66,0.12)] transition-shadow hover:shadow-[0_2px_6px_rgba(9,30,66,0.18)]">
      <p className="text-[14px] leading-5 text-[#172b4d]">{issue.title}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-[3px] text-[10px] font-bold text-white"
            style={{ backgroundColor: type.bg }}
            title={issue.type}
          >
            {type.label}
          </span>
          <span
            className="text-[13px] font-semibold uppercase tracking-wide"
            style={{ color: PRIORITY_COLOR[issue.priority] }}
            title={`${issue.priority} priority`}
          >
            ↑
          </span>
          <span className="text-[12px] font-medium text-[#5e6c84]">
            {issue.key}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {issue.points != null && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dfe1e6] px-1.5 text-[11px] font-semibold text-[#42526e]">
              {issue.points}
            </span>
          )}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: AVATAR_COLORS[issue.assignee] ?? '#5e6c84' }}
            title={issue.assignee}
          >
            {issue.assignee}
          </span>
        </div>
      </div>
    </div>
  )
}

export function JiraBoard({ company }: { company: Company }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[#172b4d]">
      {/* App top bar */}
      <header className="flex h-11 shrink-0 items-center gap-4 border-b border-[#dfe1e6] px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0052cc] text-[13px] font-bold text-white">
            J
          </div>
          <span className="text-[15px] font-semibold text-[#42526e]">
            Jira
          </span>
        </div>
        <div className="ml-2 hidden items-center gap-5 text-[14px] font-medium text-[#42526e] md:flex">
          <span>Your work</span>
          <span>Projects</span>
          <span>Filters</span>
          <span>Dashboards</span>
        </div>
        <button className="ml-2 hidden items-center gap-1 rounded bg-[#0052cc] px-3 py-1 text-[14px] font-medium text-white hover:bg-[#0747a6] md:flex">
          <Plus className="h-4 w-4" />
          Create
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded border border-[#dfe1e6] px-2 py-1 text-[#5e6c84] sm:flex">
            <Search className="h-4 w-4" />
            <span className="text-[13px]">Search</span>
          </div>
          <Bell className="h-5 w-5 text-[#42526e]" />
          <HelpCircle className="h-5 w-5 text-[#42526e]" />
          <Settings className="h-5 w-5 text-[#42526e]" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6554c0] text-[12px] font-semibold text-white">
            JA
          </span>
        </div>
      </header>

      {/* Board header */}
      <div className="shrink-0 px-6 pt-5">
        <div className="flex items-center gap-2 text-[13px] text-[#5e6c84]">
          <span>Projects</span>
          <span>/</span>
          <span>{company.name}</span>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded text-[14px] font-bold text-white"
            style={{ backgroundColor: company.accent }}
          >
            {company.code.slice(0, 2)}
          </span>
          <h1 className="text-[24px] font-semibold text-[#172b4d]">
            {company.name} board
          </h1>
          <span className="ml-2 rounded bg-[#dfe1e6] px-2 py-0.5 text-[12px] font-semibold text-[#42526e]">
            {company.sprint}
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="min-h-0 flex-1 overflow-auto px-6 pb-6 pt-5">
        <div className="grid grid-cols-4 gap-3">
          {company.columns.map((col) => (
            <section
              key={col.id}
              className="flex flex-col rounded-[3px] bg-[#f4f5f7] p-2"
            >
              <header className="flex items-center justify-between px-1 pb-2">
                <h2 className="text-[12px] font-semibold uppercase tracking-wide text-[#5e6c84]">
                  {col.name}
                </h2>
                <span className="text-[12px] font-medium text-[#5e6c84]">
                  {col.issues.length}
                </span>
              </header>
              <div className="flex flex-col gap-2">
                {col.issues.map((issue) => (
                  <IssueCard key={issue.key} issue={issue} />
                ))}
                {col.issues.length === 0 && (
                  <div className="rounded-[3px] border border-dashed border-[#dfe1e6] py-6 text-center text-[12px] text-[#97a0af]">
                    No issues
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
