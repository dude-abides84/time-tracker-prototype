'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type DropdownProps = {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  className?: string
  menuClassName?: string
}

export function Dropdown({
  trigger,
  children,
  align = 'left',
  className,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="block text-left"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName ?? ''}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

type DropdownItemProps = {
  children: ReactNode
  onSelect?: () => void
  active?: boolean
}

export function DropdownItem({ children, onSelect, active }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[15px] transition-colors hover:bg-muted ${
        active ? 'bg-brand-soft text-brand' : 'text-card-foreground'
      }`}
    >
      {children}
    </button>
  )
}
