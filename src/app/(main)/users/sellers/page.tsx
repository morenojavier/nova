'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Search, Plus, MoreHorizontal, UserCog, TrendingUp, DollarSign, FileText,
  Trophy, Star, Target, Zap, Calendar, Activity,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type SellerStatus = 'Activo' | 'Inactivo'
type SellerLevel = 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante'

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  agency: string
  group: string
  sales: number
  commission: number
  policiesSold: number
  status: SellerStatus
  startDate: string
  // Gamification fields
  policiesThisMonth: number
  quotesGenerated: number
  quotesThisMonth: number
  conversionRate: number
  monthlySalesAmount: number
  points: number
  level: SellerLevel
  rank: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeLevel(points: number): SellerLevel {
  if (points >= 30000) return 'Diamante'
  if (points >= 20000) return 'Platino'
  if (points >= 10000) return 'Oro'
  if (points >= 5000) return 'Plata'
  return 'Bronce'
}

function computePoints(policiesSold: number, conversionRate: number, sales: number): number {
  return Math.round(policiesSold * 50 + conversionRate * 10 + sales / 1000)
}

// ─── Raw Seller Data (before rank/level/points computed) ──────────────────────

interface RawSeller {
  id: string; name: string; email: string; phone: string; agency: string; group: string;
  sales: number; commission: number; policiesSold: number; status: SellerStatus; startDate: string;
  policiesThisMonth: number; quotesGenerated: number; quotesThisMonth: number; monthlySalesAmount: number;
}

const RAW: RawSeller[] = [
  // Andrés Solís — top performer Norte
  { id: '1',  name: 'Andrés Solís Montaño',     email: 'asolis@toyotamty.mx',    phone: '81 1234 0001', agency: 'Toyota Monterrey',      group: 'Grupo Automotriz del Norte', sales: 286400, commission: 42960, policiesSold: 34, status: 'Activo',   startDate: '12/04/2022', policiesThisMonth: 11, quotesGenerated: 62, quotesThisMonth: 18, monthlySalesAmount: 92400 },
  { id: '2',  name: 'Marisol Acevedo Paz',       email: 'macevedo@toyotamty.mx',  phone: '81 1234 0002', agency: 'Toyota Monterrey',      group: 'Grupo Automotriz del Norte', sales: 218900, commission: 32835, policiesSold: 28, status: 'Activo',   startDate: '03/09/2023', policiesThisMonth: 7,  quotesGenerated: 70, quotesThisMonth: 15, monthlySalesAmount: 54600 },
  { id: '3',  name: 'Javier Canales Ruiz',       email: 'jcanales@hondasp.mx',    phone: '81 5678 0010', agency: 'Honda San Pedro',       group: 'Grupo Automotriz del Norte', sales: 174500, commission: 26175, policiesSold: 22, status: 'Activo',   startDate: '20/01/2024', policiesThisMonth: 5,  quotesGenerated: 55, quotesThisMonth: 12, monthlySalesAmount: 39800 },
  { id: '4',  name: 'Carolina Estrada Vivas',    email: 'cestrada@hondasp.mx',    phone: '81 5678 0011', agency: 'Honda San Pedro',       group: 'Grupo Automotriz del Norte', sales:  89300, commission: 13395, policiesSold: 12, status: 'Inactivo', startDate: '05/11/2023', policiesThisMonth: 2,  quotesGenerated: 48, quotesThisMonth:  9, monthlySalesAmount: 14200 },
  { id: '5',  name: 'Pablo Trejo Ortega',        email: 'ptrejo@nissanapd.mx',    phone: '81 2468 0020', agency: 'Nissan Apodaca',        group: 'Grupo Automotriz del Norte', sales: 241200, commission: 36180, policiesSold: 31, status: 'Activo',   startDate: '08/06/2023', policiesThisMonth: 9,  quotesGenerated: 67, quotesThisMonth: 16, monthlySalesAmount: 72300 },
  // Gabriela Sosa — top performer Premium
  { id: '6',  name: 'Gabriela Sosa Mendoza',     email: 'gsosa@mazdapol.mx',      phone: '55 9876 0030', agency: 'Mazda Polanco',         group: 'Grupo Premium Motors',       sales: 312800, commission: 46920, policiesSold: 38, status: 'Activo',   startDate: '15/02/2022', policiesThisMonth: 12, quotesGenerated: 71, quotesThisMonth: 21, monthlySalesAmount: 98600 },
  { id: '7',  name: 'Eduardo Cárdenas Islas',    email: 'ecardenas@mazdapol.mx',  phone: '55 9876 0031', agency: 'Mazda Polanco',         group: 'Grupo Premium Motors',       sales: 195600, commission: 29340, policiesSold: 24, status: 'Activo',   startDate: '01/10/2023', policiesThisMonth: 6,  quotesGenerated: 58, quotesThisMonth: 14, monthlySalesAmount: 47200 },
  // Natalia Zepeda — #1 overall
  { id: '8',  name: 'Natalia Zepeda Luna',       email: 'nzepeda@toyotasf.mx',    phone: '55 3456 0040', agency: 'Toyota Santa Fe',       group: 'Grupo Premium Motors',       sales: 408500, commission: 61275, policiesSold: 51, status: 'Activo',   startDate: '20/03/2021', policiesThisMonth: 15, quotesGenerated: 88, quotesThisMonth: 24, monthlySalesAmount: 134500 },
  { id: '9',  name: 'Roberto Fierro Quiroz',     email: 'rfierro@toyotasf.mx',    phone: '55 3456 0041', agency: 'Toyota Santa Fe',       group: 'Grupo Premium Motors',       sales: 287900, commission: 43185, policiesSold: 35, status: 'Activo',   startDate: '14/07/2022', policiesThisMonth: 8,  quotesGenerated: 72, quotesThisMonth: 17, monthlySalesAmount: 89100 },
  { id: '10', name: 'Alejandra Nieto Serna',     email: 'anieto@hyundaisat.mx',   phone: '55 6789 0050', agency: 'Hyundai Satélite',      group: 'Grupo Premium Motors',       sales: 156400, commission: 23460, policiesSold: 19, status: 'Activo',   startDate: '28/04/2024', policiesThisMonth: 4,  quotesGenerated: 44, quotesThisMonth: 10, monthlySalesAmount: 32100 },
  { id: '11', name: 'Iván Murillo Tapia',        email: 'imurillo@chevgdl.mx',    phone: '33 1111 0060', agency: 'Chevrolet Guadalajara', group: 'Grupo Centro Occidente',     sales: 268700, commission: 40305, policiesSold: 32, status: 'Activo',   startDate: '09/08/2022', policiesThisMonth: 8,  quotesGenerated: 74, quotesThisMonth: 19, monthlySalesAmount: 78500 },
  { id: '12', name: 'Verónica Ibáñez Castro',    email: 'vibanez@fordzpn.mx',     phone: '33 2222 0070', agency: 'Ford Zapopan',          group: 'Grupo Centro Occidente',     sales: 192100, commission: 28815, policiesSold: 24, status: 'Activo',   startDate: '18/11/2023', policiesThisMonth: 5,  quotesGenerated: 60, quotesThisMonth: 13, monthlySalesAmount: 46800 },
  { id: '13', name: 'Sergio Barrón Delgado',     email: 'sbarron@kiatonala.mx',   phone: '33 3333 0080', agency: 'Kia Tonalá',            group: 'Grupo Centro Occidente',     sales: 104500, commission: 15675, policiesSold: 14, status: 'Activo',   startDate: '01/02/2024', policiesThisMonth: 3,  quotesGenerated: 40, quotesThisMonth:  8, monthlySalesAmount: 26200 },
  { id: '14', name: 'Regina Villafaña Olmos',    email: 'rvillafana@toyotamer.mx',phone: '99 4444 0090', agency: 'Toyota Mérida',         group: 'Grupo Península',            sales: 172300, commission: 25845, policiesSold: 21, status: 'Activo',   startDate: '12/12/2023', policiesThisMonth: 5,  quotesGenerated: 50, quotesThisMonth: 11, monthlySalesAmount: 41600 },
  { id: '15', name: 'Mauricio Pérez Galindo',    email: 'mperez@vwcun.mx',        phone: '99 5555 0100', agency: 'VW Cancún',             group: 'Grupo Península',            sales: 128900, commission: 19335, policiesSold: 16, status: 'Activo',   startDate: '25/03/2024', policiesThisMonth: 3,  quotesGenerated: 46, quotesThisMonth:  9, monthlySalesAmount: 28900 },
  { id: '16', name: 'Karla Vázquez Romero',      email: 'kvazquez@mazdaqro.mx',   phone: '44 6666 0110', agency: 'Mazda Querétaro',       group: 'Grupo Bajío Motors',         sales: 112400, commission: 16860, policiesSold: 14, status: 'Activo',   startDate: '07/01/2023', policiesThisMonth: 3,  quotesGenerated: 36, quotesThisMonth:  7, monthlySalesAmount: 24800 },
]

// Compute derived fields + rank
const SELLERS: Seller[] = (() => {
  const withPoints = RAW.map((r) => {
    const conversionRate = parseFloat(((r.policiesSold / r.quotesGenerated) * 100).toFixed(1))
    const points = computePoints(r.policiesSold, conversionRate, r.sales)
    return { ...r, conversionRate, points, level: computeLevel(points), rank: 0 }
  })
  // Sort descending by points to assign ranks
  const sorted = [...withPoints].sort((a, b) => b.points - a.points)
  const rankMap: Record<string, number> = {}
  sorted.forEach((s, i) => { rankMap[s.id] = i + 1 })
  return withPoints.map((s) => ({ ...s, rank: rankMap[s.id] }))
})()

// ─── Mock daily data for Cotizaciones (deterministic, module-level) ────────────

interface DailyData {
  date: Date
  count: number
}

const DAILY_COUNTS: number[] = [
  23, 31, 18, 42, 37, 29, 14, 47, 33, 28, 40, 22, 35, 19,
]

// Reference date: today is 2026-04-27
const REFERENCE_DATE = new Date(2026, 3, 27) // month is 0-indexed

const DAILY_DATA: DailyData[] = DAILY_COUNTS.map((count, i) => {
  const d = new Date(REFERENCE_DATE)
  d.setDate(REFERENCE_DATE.getDate() - (13 - i))
  return { date: d, count }
})

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const ORDERED_WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Aggregate DAILY_DATA by weekday
const WEEKDAY_TOTALS: Record<string, number> = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0, Dom: 0 }
DAILY_DATA.forEach(({ date, count }) => {
  const name = DAY_NAMES[date.getDay()]
  if (name in WEEKDAY_TOTALS) {
    WEEKDAY_TOTALS[name] += count
  }
})

// Mock "ultima cotizacion" labels per seller (deterministic by seller id)
const RELATIVE_LABELS = ['Hoy', 'Ayer', 'Hace 2 días', 'Hace 3 días', 'Hace 4 días', 'Hace 5 días', 'Hace 1 semana']
function mockLastQuote(sellerId: string): string {
  const idx = parseInt(sellerId, 10) % RELATIVE_LABELS.length
  return RELATIVE_LABELS[idx]
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<SellerStatus, string> = {
  Activo: 'bg-success hover:bg-success text-white',
  Inactivo: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

const LEVEL_STYLES: Record<SellerLevel, string> = {
  Bronce: 'bg-amber-100 text-amber-800 border-transparent',
  Plata: 'bg-slate-200 text-slate-700 border-transparent',
  Oro: 'bg-yellow-100 text-yellow-800 border-transparent',
  Platino: 'bg-cyan-100 text-cyan-800 border-transparent',
  Diamante: 'bg-purple-100 text-purple-800 border-transparent',
}

const CONVERSION_STYLES = (rate: number) => {
  if (rate >= 50) return 'bg-green-100 text-green-800 border-transparent'
  if (rate >= 25) return 'bg-yellow-100 text-yellow-800 border-transparent'
  return 'bg-red-100 text-red-800 border-transparent'
}

const formatMXN = (n: number) => '$' + n.toLocaleString('es-MX')

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarCircle({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }[size]
  return (
    <div className={cn('rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0', sizeClass)}>
      {getInitials(name)}
    </div>
  )
}

function LevelBadge({ level }: { level: SellerLevel }) {
  return (
    <Badge className={cn('text-xs font-semibold', LEVEL_STYLES[level])}>
      {level}
    </Badge>
  )
}

// ─── Podium Card ──────────────────────────────────────────────────────────────

const PODIUM_CONFIG = [
  { pos: 1, label: '1er Lugar', bg: 'from-yellow-50 to-amber-100', border: 'border-yellow-300', iconColor: 'text-yellow-500', scale: 'md:scale-105' },
  { pos: 2, label: '2do Lugar', bg: 'from-slate-50 to-slate-200', border: 'border-slate-300', iconColor: 'text-slate-500', scale: '' },
  { pos: 3, label: '3er Lugar', bg: 'from-orange-50 to-amber-200/60', border: 'border-amber-400', iconColor: 'text-amber-700', scale: '' },
]

function PodiumCard({ seller, pos }: { seller: Seller; pos: 1 | 2 | 3 }) {
  const cfg = PODIUM_CONFIG[pos - 1]
  return (
    <div className={cn('relative rounded-lg border p-3 flex items-center gap-3 bg-gradient-to-r transition-transform', cfg.bg, cfg.border)}>
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <Trophy className={cn('w-5 h-5', cfg.iconColor)} />
        <span className="text-[10px] font-semibold text-muted-foreground">{cfg.label}</span>
      </div>
      <AvatarCircle name={seller.name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-primary text-sm leading-tight truncate">{seller.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{seller.agency}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-primary leading-none">{seller.policiesThisMonth}</span>
          <span className="text-[10px] text-muted-foreground">pólizas · {formatMXN(seller.monthlySalesAmount)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Conversion Bar ───────────────────────────────────────────────────────────

function ConversionBar({ rate }: { rate: number }) {
  const barColor = rate >= 50 ? 'bg-green-500' : rate >= 25 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
      <span className="text-xs font-medium w-9 text-right">{rate}%</span>
    </div>
  )
}

// ─── Cotizaciones View ────────────────────────────────────────────────────────

function CotizacionesView() {
  const totalCotizaciones = SELLERS.reduce((sum, s) => sum + s.quotesGenerated, 0)
  const promedioDiario = Math.round(totalCotizaciones / 30)
  const maxDailyCount = Math.max(...DAILY_DATA.map(d => d.count))

  // Top sellers by quotesGenerated
  const topSellers = useMemo(
    () => [...SELLERS].sort((a, b) => b.quotesGenerated - a.quotesGenerated).slice(0, 10),
    []
  )

  const maxWeekdayCount = Math.max(...Object.values(WEEKDAY_TOTALS))
  const maxWeekdayName = ORDERED_WEEKDAYS.find(
    d => WEEKDAY_TOTALS[d] === maxWeekdayCount
  ) ?? 'Miércoles'

  return (
    <div className="space-y-6">
      {/* Section A: Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalCotizaciones}</p>
              <p className="text-xs text-muted-foreground">Total cotizaciones</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{promedioDiario}</p>
              <p className="text-xs text-muted-foreground">Promedio diario</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Calendar className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{maxWeekdayName}</p>
              <p className="text-xs text-muted-foreground">Día más activo</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <FileText className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">47</p>
              <p className="text-xs text-muted-foreground">Cotizaciones hoy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section B: Horizontal bar chart — últimos 14 días */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Actividad diaria — últimos 14 días</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {DAILY_DATA.map(({ date, count }) => {
            const dayName = DAY_NAMES[date.getDay()]
            const dd = String(date.getDate()).padStart(2, '0')
            const mm = String(date.getMonth() + 1).padStart(2, '0')
            const label = `${dayName} ${dd}/${mm}`
            const pct = (count / maxDailyCount) * 100
            return (
              <div key={date.toISOString()} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16 shrink-0 text-right">{label}</span>
                <div className="flex-1 h-5 rounded bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded bg-gradient-to-r from-primary to-primary/70 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary w-6 shrink-0">{count}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Section C: Vertical bar chart — por día de la semana */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Distribución por día de la semana</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-around gap-2 h-36">
            {ORDERED_WEEKDAYS.map((day) => {
              const count = WEEKDAY_TOTALS[day]
              const isMax = count === maxWeekdayCount
              const heightPct = maxWeekdayCount > 0 ? (count / maxWeekdayCount) * 100 : 0
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <span className={cn('text-xs font-semibold', isMax ? 'text-primary' : 'text-muted-foreground')}>
                    {count}
                  </span>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className={cn(
                        'w-full rounded-t transition-all',
                        isMax ? 'bg-primary' : 'bg-primary/30'
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={cn('text-xs font-medium', isMax ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section D: Top vendedores cotizando */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Vendedores con más cotizaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-100">
            {topSellers.map((seller, i) => {
              const pos = i + 1
              const lastQuote = mockLastQuote(seller.id)
              return (
                <li
                  key={seller.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors"
                >
                  {/* Position */}
                  <span className={cn(
                    'w-6 text-center text-sm font-bold shrink-0',
                    pos === 1 ? 'text-yellow-500' :
                    pos === 2 ? 'text-slate-500' :
                    pos === 3 ? 'text-amber-700' :
                    'text-muted-foreground'
                  )}>
                    {pos}
                  </span>

                  {/* Avatar */}
                  <AvatarCircle name={seller.name} size="sm" />

                  {/* Name + agency */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary leading-tight truncate">{seller.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{seller.agency}</p>
                  </div>

                  {/* Last quote */}
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <span className="text-[11px] text-muted-foreground">Última cotización</span>
                    <span className="text-xs font-medium text-foreground">{lastQuote}</span>
                  </div>

                  {/* Conversion badge */}
                  <Badge className={cn('text-xs font-semibold hidden md:inline-flex', CONVERSION_STYLES(seller.conversionRate))}>
                    {seller.conversionRate}%
                  </Badge>

                  {/* Quotes count */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary leading-none">{seller.quotesGenerated}</p>
                    <p className="text-[10px] text-muted-foreground">cotizaciones</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SellersPage() {
  const [view, setView] = useState<'vendedores' | 'cotizaciones'>('vendedores')
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<string>('Todos')
  const [agencyFilter, setAgencyFilter] = useState<string>('Todas')

  const groups = useMemo(() => ['Todos', ...Array.from(new Set(SELLERS.map(s => s.group)))], [])
  const agencies = useMemo(() => {
    const list = groupFilter === 'Todos'
      ? SELLERS.map(s => s.agency)
      : SELLERS.filter(s => s.group === groupFilter).map(s => s.agency)
    return ['Todas', ...Array.from(new Set(list)).sort()]
  }, [groupFilter])

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return SELLERS.filter((s) => {
      const matchesGroup = groupFilter === 'Todos' || s.group === groupFilter
      const matchesAgency = agencyFilter === 'Todas' || s.agency === agencyFilter
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.agency.toLowerCase().includes(term) ||
        s.group.toLowerCase().includes(term)
      return matchesGroup && matchesAgency && matchesSearch
    })
  }, [search, groupFilter, agencyFilter])

  const totalSales = filtered.reduce((sum, s) => sum + s.sales, 0)
  const totalCommission = filtered.reduce((sum, s) => sum + s.commission, 0)
  const totalPolicies = filtered.reduce((sum, s) => sum + s.policiesSold, 0)

  // Top 3 this month by policiesThisMonth
  const top3 = useMemo(
    () => [...SELLERS].sort((a, b) => b.policiesThisMonth - a.policiesThisMonth || b.monthlySalesAmount - a.monthlySalesAmount).slice(0, 3),
    []
  )

  const selectClass = 'flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Section A: Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Vendedores</h1>
          <p className="text-muted-foreground mt-2">
            Asesores que pertenecen a las agencias. Consulta su desempeño, puntos y pólizas generadas.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Nuevo Vendedor
        </Button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setView('vendedores')}
            className={cn(
              'pb-3 text-sm transition-colors border-b-2',
              view === 'vendedores'
                ? 'border-b-2 border-primary text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            )}
          >
            Vendedores
          </button>
          <button
            onClick={() => setView('cotizaciones')}
            className={cn(
              'pb-3 text-sm transition-colors border-b-2',
              view === 'cotizaciones'
                ? 'border-b-2 border-primary text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            )}
          >
            Cotizaciones
          </button>
        </div>
      </div>

      {/* ── Vendedores View ── */}
      {view === 'vendedores' && (
        <>
          {/* ── Section B: Top 3 del Mes ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-primary">Top 3 del Mes</h2>
              <span className="text-sm text-muted-foreground">por pólizas vendidas en abril 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              {/* 2nd - left */}
              <PodiumCard seller={top3[1]} pos={2} />
              {/* 1st - center (scaled up via CSS) */}
              <PodiumCard seller={top3[0]} pos={1} />
              {/* 3rd - right */}
              <PodiumCard seller={top3[2]} pos={3} />
            </div>
          </div>

          {/* ── Section C: Stats Summary ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/5">
                  <UserCog className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{filtered.length}</p>
                  <p className="text-xs text-muted-foreground">Vendedores</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <DollarSign className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{formatMXN(totalSales)}</p>
                  <p className="text-xs text-muted-foreground">Ventas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{formatMXN(totalCommission)}</p>
                  <p className="text-xs text-muted-foreground">Comisiones</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileText className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{totalPolicies}</p>
                  <p className="text-xs text-muted-foreground">Pólizas vendidas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Section E: Tabla Detallada ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CardTitle>Directorio de Vendedores</CardTitle>
                    <span className="text-sm text-muted-foreground font-normal">
                      {filtered.length} {filtered.length === 1 ? 'vendedor' : 'vendedores'}
                    </span>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por nombre..."
                      className="pl-8 bg-white"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground font-medium">Grupo:</label>
                    <select
                      value={groupFilter}
                      onChange={(e) => { setGroupFilter(e.target.value); setAgencyFilter('Todas') }}
                      className={selectClass}
                    >
                      {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground font-medium">Agencia:</label>
                    <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)} className={selectClass}>
                      {agencies.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="rounded-b-md border-t overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Agencia</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          Cotizaciones
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          Pólizas
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          Conversión
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Ventas mes</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          Puntos
                        </div>
                      </TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                          No se encontraron vendedores con esos filtros.
                        </TableCell>
                      </TableRow>
                    )}

                    {filtered.map((seller) => {
                      const topPos = top3.findIndex(t => t.id === seller.id) + 1 // 1, 2, 3, or 0
                      const rowStyle = topPos === 1
                        ? 'bg-yellow-50/80 hover:bg-yellow-100/80 border-l-4 border-l-yellow-400'
                        : topPos === 2
                          ? 'bg-slate-100/60 hover:bg-slate-200/60 border-l-4 border-l-slate-400'
                          : topPos === 3
                            ? 'bg-amber-50/80 hover:bg-amber-100/80 border-l-4 border-l-amber-500'
                            : 'hover:bg-slate-50/50'
                      return (
                      <TableRow key={seller.id} className={cn(rowStyle, 'transition-colors')}>
                        {/* Vendedor */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarCircle name={seller.name} size="sm" />
                            <div>
                              <p className="font-semibold text-primary text-sm leading-tight flex items-center gap-1.5">
                                {topPos > 0 && (
                                  <Trophy className={cn('w-3.5 h-3.5',
                                    topPos === 1 ? 'text-yellow-500' :
                                    topPos === 2 ? 'text-slate-500' :
                                    'text-amber-700'
                                  )} />
                                )}
                                {seller.name}
                              </p>
                              <p className="text-xs text-muted-foreground">#{seller.rank}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contacto */}
                        <TableCell>
                          <div className="text-sm">{seller.email}</div>
                          <div className="text-xs text-muted-foreground">{seller.phone}</div>
                        </TableCell>

                        {/* Agencia */}
                        <TableCell className="text-sm">{seller.agency}</TableCell>

                        {/* Grupo */}
                        <TableCell className="text-sm text-muted-foreground">{seller.group}</TableCell>

                        {/* Cotizaciones */}
                        <TableCell className="text-center">
                          <span className="text-sm font-semibold text-primary">{seller.quotesGenerated}</span>
                        </TableCell>

                        {/* Pólizas */}
                        <TableCell className="text-center">
                          <span className="text-sm font-semibold text-primary">{Math.min(seller.policiesSold, seller.quotesGenerated)}</span>
                        </TableCell>

                        {/* Conversión */}
                        <TableCell className="text-center">
                          <Badge className={cn('text-xs font-semibold', CONVERSION_STYLES(seller.conversionRate))}>
                            {seller.conversionRate}%
                          </Badge>
                        </TableCell>

                        {/* Ventas mensuales */}
                        <TableCell className="text-right font-semibold text-primary">
                          {formatMXN(seller.monthlySalesAmount)}
                        </TableCell>

                        {/* Puntos + nivel */}
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm font-bold text-primary">{seller.points.toLocaleString('es-MX')}</span>
                            </div>
                            <LevelBadge level={seller.level} />
                          </div>
                        </TableCell>

                        {/* Estado */}
                        <TableCell>
                          <Badge className={cn('text-xs font-medium', STATUS_STYLES[seller.status])}>
                            {seller.status}
                          </Badge>
                        </TableCell>

                        {/* Acciones */}
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Cotizaciones View ── */}
      {view === 'cotizaciones' && <CotizacionesView />}

    </div>
  )
}
