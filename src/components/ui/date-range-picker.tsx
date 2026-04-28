'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface DateRange {
  from: Date
  to: Date
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  trigger?: React.ReactNode
}

/* ─────────────────────────────────────────────
   Date helpers
   ───────────────────────────────────────────── */

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const MONTHS_SHORT = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const DAYS_SHORT = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá']

/** "1 de abril de 2026" */
function formatLong(d: Date): string {
  return `${d.getDate()} de ${MONTHS_SHORT[d.getMonth()]} de ${d.getFullYear()}`
}

/** "01/04/2026" */
function formatShort(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

/** Parse "DD/MM/YYYY" or "DD-MM-YYYY" → Date | null */
function parseShort(text: string): Date | null {
  const m = text.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2]) - 1
  const year = Number(m[3])
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  const d = new Date(year, month, day)
  // Verify (handles invalid dates like 31/02/...)
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null
  return startOfDay(d)
}

/** "1 de abril – 27 de abril de 2026" */
function formatRange(from: Date, to: Date): string {
  const fromDay = from.getDate()
  const fromMonth = MONTHS_SHORT[from.getMonth()]
  const toStr = formatLong(to)
  if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
    return `${fromDay} de ${fromMonth} – ${toStr}`
  }
  return `${formatLong(from)} – ${toStr}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Build a 6×7 grid for a given year/month.
 *  Each cell: { date, currentMonth: boolean }
 */
function buildMonthGrid(year: number, month: number): { date: Date; currentMonth: boolean }[][] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Sunday = 0 in JS, but our grid starts with Sunday too (do lu ma mi ju vi sá)
  const startOffset = firstDay.getDay() // 0=Sun
  const totalDays = lastDay.getDate()

  const cells: { date: Date; currentMonth: boolean }[] = []

  // Prefix with days from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    cells.push({ date: d, currentMonth: false })
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ date: new Date(year, month, d), currentMonth: true })
  }

  // Suffix with days from next month until we fill 6 rows (42 cells)
  let next = 1
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, next++), currentMonth: false })
  }

  // Chunk into rows of 7
  const rows: { date: Date; currentMonth: boolean }[][] = []
  for (let i = 0; i < 42; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
}

/* ─────────────────────────────────────────────
   Presets
   ───────────────────────────────────────────── */

type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'lastMonth'
  | 'thisMonth'
  | 'mtd'
  | 'thisQuarter'
  | 'ytd'
  | 'custom'

interface Preset {
  key: PresetKey
  label: string
}

const PRESETS: Preset[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'last30', label: 'Últimos 30 días' },
  { key: 'lastMonth', label: 'Mes anterior' },
  { key: 'thisMonth', label: 'Este mes' },
  { key: 'mtd', label: 'Período hasta la fecha' },
  { key: 'thisQuarter', label: 'Trimestre actual' },
  { key: 'ytd', label: 'Año a la fecha' },
  { key: 'custom', label: 'Rango personalizado' },
]

function resolvePreset(key: PresetKey): DateRange {
  const today = startOfDay(new Date())
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)

  switch (key) {
    case 'today':
      return { from: today, to: today }
    case 'yesterday':
      return { from: yesterday, to: yesterday }
    case 'last7': {
      const from = new Date(today); from.setDate(today.getDate() - 6)
      return { from, to: today }
    }
    case 'last30': {
      const from = new Date(today); from.setDate(today.getDate() - 29)
      return { from, to: today }
    }
    case 'lastMonth':
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      }
    case 'thisMonth':
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      }
    case 'mtd':
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      }
    case 'thisQuarter': {
      const q = Math.floor(today.getMonth() / 3)
      return {
        from: new Date(today.getFullYear(), q * 3, 1),
        to: new Date(today.getFullYear(), q * 3 + 3, 0),
      }
    }
    case 'ytd':
      return {
        from: new Date(today.getFullYear(), 0, 1),
        to: today,
      }
    case 'custom':
      return { from: today, to: today }
  }
}

function matchPreset(range: DateRange): PresetKey {
  for (const p of PRESETS) {
    if (p.key === 'custom') continue
    const r = resolvePreset(p.key)
    if (isSameDay(r.from, range.from) && isSameDay(r.to, range.to)) return p.key
  }
  return 'custom'
}

/* ─────────────────────────────────────────────
   Mini calendar for one month
   ───────────────────────────────────────────── */

interface MonthCalendarProps {
  year: number
  month: number
  selecting: { from: Date | null; to: Date | null }
  onDayClick: (d: Date) => void
  hovered: Date | null
  onDayHover: (d: Date | null) => void
}

function MonthCalendar({ year, month, selecting, onDayClick, hovered, onDayHover }: MonthCalendarProps) {
  const grid = buildMonthGrid(year, month)
  const { from, to } = selecting

  function dayState(date: Date) {
    const d = startOfDay(date)
    const isFrom = from && isSameDay(d, from)
    const isTo = to ? isSameDay(d, to) : (hovered && from && !to && isSameDay(d, hovered))

    // effective end for range highlight
    const effectiveTo = to ?? (hovered && from && hovered > from ? hovered : null)

    const inRange = from && effectiveTo &&
      d > startOfDay(from) && d < startOfDay(effectiveTo)

    return { isFrom, isTo, inRange }
  }

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {grid.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map(({ date, currentMonth }, di) => {
            const { isFrom, isTo, inRange } = dayState(date)
            const isEdge = isFrom || isTo

            return (
              <div
                key={di}
                className={cn(
                  'relative flex items-center justify-center',
                  // range background strip (not on edge cells)
                  inRange && 'bg-slate-100',
                  // round left edge of range on start
                  isFrom && to && 'rounded-l-full',
                  // round right edge of range on end
                  isTo && from && 'rounded-r-full',
                  // if no range yet, full round on single selection
                  isFrom && !to && !hovered && 'rounded-full',
                )}
              >
                <button
                  type="button"
                  onClick={() => onDayClick(date)}
                  onMouseEnter={() => onDayHover(date)}
                  onMouseLeave={() => onDayHover(null)}
                  className={cn(
                    'w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors',
                    // outside current month
                    !currentMonth && 'text-muted-foreground/40',
                    // inside range
                    inRange && !isEdge && 'text-primary hover:bg-slate-200',
                    // edge: filled circle
                    isEdge && 'bg-primary text-white font-semibold hover:bg-primary/90',
                    // default hover for non-edge, in-month
                    !isEdge && !inRange && currentMonth && 'hover:bg-slate-100 text-foreground',
                    !isEdge && !inRange && !currentMonth && 'hover:bg-slate-50',
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */

export function DateRangePicker({ value, onChange, trigger }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  // Internal draft state (not committed until "Aplicar")
  const [draft, setDraft] = useState<{ from: Date | null; to: Date | null }>({
    from: value.from,
    to: value.to,
  })
  const [hovered, setHovered] = useState<Date | null>(null)
  const [activePreset, setActivePreset] = useState<PresetKey>(() => matchPreset(value))

  // Raw text values for the input fields — separate from the parsed draft so the user
  // can type freely (e.g. partial input like "15" or "15/04") without losing focus.
  const [fromInput, setFromInput] = useState<string>(() => formatShort(value.from))
  const [toInput, setToInput] = useState<string>(() => formatShort(value.to))

  // Calendar navigation: left panel shows [viewMonth, viewMonth+1]
  const [viewYear, setViewYear] = useState(value.from.getFullYear())
  const [viewMonth, setViewMonth] = useState(value.from.getMonth())

  const containerRef = useRef<HTMLDivElement>(null)

  // Sync draft when value prop changes externally
  useEffect(() => {
    setDraft({ from: value.from, to: value.to })
    setActivePreset(matchPreset(value))
    setFromInput(formatShort(value.from))
    setToInput(formatShort(value.to))
  }, [value.from, value.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync input strings when draft changes from preset / calendar click
  useEffect(() => {
    if (draft.from) setFromInput(formatShort(draft.from))
  }, [draft.from])
  useEffect(() => {
    if (draft.to) setToInput(formatShort(draft.to))
  }, [draft.to])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleOpen = () => {
    setDraft({ from: value.from, to: value.to })
    setActivePreset(matchPreset(value))
    setViewYear(value.from.getFullYear())
    setViewMonth(value.from.getMonth())
    setOpen(true)
  }

  const handlePreset = (key: PresetKey) => {
    setActivePreset(key)
    if (key !== 'custom') {
      const r = resolvePreset(key)
      setDraft({ from: r.from, to: r.to })
      setViewYear(r.from.getFullYear())
      setViewMonth(r.from.getMonth())
    }
  }

  const handleDayClick = useCallback((date: Date) => {
    const d = startOfDay(date)
    setActivePreset('custom')

    setDraft(prev => {
      if (!prev.from || (prev.from && prev.to)) {
        // Start fresh selection
        return { from: d, to: null }
      }
      // from is set, to is not
      if (isSameDay(d, prev.from)) {
        // Same day — treat as single-day range
        return { from: d, to: d }
      }
      if (d > prev.from) {
        return { from: prev.from, to: d }
      }
      // Clicked before from — swap
      return { from: d, to: prev.from }
    })
  }, [])

  const handleApply = () => {
    if (draft.from && draft.to) {
      onChange({ from: draft.from, to: draft.to })
    } else if (draft.from) {
      onChange({ from: draft.from, to: draft.from })
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // Second calendar month
  const month2 = viewMonth === 11 ? 0 : viewMonth + 1
  const year2 = viewMonth === 11 ? viewYear + 1 : viewYear

  // Display text for trigger
  const triggerText = formatRange(value.from, value.to)

  // Display text for date inputs in header (DD/MM/YYYY for editing)

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      {trigger ? (
        <div onClick={handleOpen} className="cursor-pointer">{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-primary transition-colors"
          aria-label="Seleccionar rango de fechas"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{triggerText}</span>
        </button>
      )}

      {/* Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Selector de rango de fechas"
          className="absolute right-0 top-full mt-2 z-50 flex rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
          style={{ width: 720 }}
        >
          {/* Left sidebar: presets */}
          <aside className="w-44 shrink-0 border-r border-slate-100 bg-slate-50 py-3 px-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Período
            </p>
            <nav>
              <ul role="listbox" aria-label="Presets de rango">
                {PRESETS.map(p => (
                  <li key={p.key} role="option" aria-selected={activePreset === p.key}>
                    <button
                      type="button"
                      onClick={() => handlePreset(p.key)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                        activePreset === p.key
                          ? 'bg-slate-100 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-slate-100 hover:text-primary',
                      )}
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Right panel */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Date inputs row (editable text DD/MM/AAAA) */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-slate-100">
              <input
                type="text"
                value={fromInput}
                onChange={(e) => {
                  const v = e.target.value
                  setFromInput(v)
                  const parsed = parseShort(v)
                  if (parsed) {
                    setDraft(d => ({ ...d, from: parsed }))
                    setViewYear(parsed.getFullYear())
                    setViewMonth(parsed.getMonth())
                    setActivePreset('custom')
                  }
                }}
                onBlur={() => {
                  // Revert to last valid draft on blur if input is invalid
                  if (draft.from && !parseShort(fromInput)) {
                    setFromInput(formatShort(draft.from))
                  }
                }}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                className="flex-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-sm text-primary font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                aria-label="Fecha de inicio"
              />
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={toInput}
                onChange={(e) => {
                  const v = e.target.value
                  setToInput(v)
                  const parsed = parseShort(v)
                  if (parsed) {
                    setDraft(d => ({ ...d, to: parsed }))
                    setActivePreset('custom')
                  }
                }}
                onBlur={() => {
                  if (draft.to && !parseShort(toInput)) {
                    setToInput(formatShort(draft.to))
                  }
                }}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                className="flex-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-sm text-primary font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                aria-label="Fecha de fin"
              />
              <button
                type="button"
                className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
                aria-label="Ver calendario"
                tabIndex={-1}
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Calendar navigation header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded hover:bg-slate-100 transition-colors"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>

              <div className="flex gap-16">
                <span className="text-sm font-semibold text-primary w-32 text-center">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <span className="text-sm font-semibold text-primary w-32 text-center">
                  {MONTHS[month2]} {year2}
                </span>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded hover:bg-slate-100 transition-colors"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Two-month calendar grid */}
            <div className="flex gap-4 px-4 pb-3">
              <div className="flex-1">
                <MonthCalendar
                  year={viewYear}
                  month={viewMonth}
                  selecting={draft}
                  onDayClick={handleDayClick}
                  hovered={hovered}
                  onDayHover={setHovered}
                />
              </div>
              <div className="w-px bg-slate-100 shrink-0" />
              <div className="flex-1">
                <MonthCalendar
                  year={year2}
                  month={month2}
                  selecting={draft}
                  onDayClick={handleDayClick}
                  hovered={hovered}
                  onDayHover={setHovered}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-muted-foreground hover:bg-slate-100 hover:text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!draft.from}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
