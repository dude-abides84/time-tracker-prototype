'use client'

import { ChevronDown } from 'lucide-react'
import { Dropdown, DropdownItem } from './dropdown'

export function TopNav() {
  return (
    <header className="h-[98px] w-full border-b border-border bg-card">
      <div className="mx-auto flex h-full w-full max-w-[894px] items-center justify-between px-[30px]">
        <div className="flex items-baseline gap-1.5 font-logo font-extrabold tracking-tight">
          <span className="text-[30px] text-brand">toggl</span>
          <span className="text-[26px] font-bold text-brand/55">2.0</span>
        </div>

        <div className="flex items-center gap-8">
          <button
            type="button"
            className="text-[19px] text-foreground/70 transition-colors hover:text-foreground"
          >
            Workspace
          </button>

          <Dropdown
            align="right"
            trigger={
              <div className="flex items-center gap-1.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-[14px] font-semibold text-foreground/70">
                  JA
                </span>
                <ChevronDown className="h-5 w-5 text-foreground/60" />
              </div>
            }
          >
            {(close) => (
              <>
                <div className="border-b border-border px-3.5 py-2.5">
                  <p className="text-[14px] font-semibold text-card-foreground">
                    Jamie A.
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    jamie@example.com
                  </p>
                </div>
                <DropdownItem onSelect={close}>Profile settings</DropdownItem>
                <DropdownItem onSelect={close}>Workspaces</DropdownItem>
                <DropdownItem onSelect={close}>Sign out</DropdownItem>
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
