'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DateRangePicker, type DateRange } from '@/components/ui/date-range-picker'
import { InsurerLogo } from '@/components/ui/insurer-logo'
import {
    DollarSign, Wallet, Gift, TrendingUp, Shield, FileText,
    Award, ChevronDown, Building2, Briefcase, ShieldCheck, Download,
    Search, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════════════
   Types & constants
   ═══════════════════════════════════════════════════════════════════════ */

type Metrics = {
    prima: number
    comision: number
    bonoInicial: number
    bonoSiniestral: number
    bonoRenovacion: number
    bonoCartera: number
    bonoIntegral: number
    udi: number
    intervita: number
    nova: number
    polizas: number
}

type ReportType =
    | 'todas'
    | 'insurer'
    | 'group-insurer'
    | 'group'
    | 'agency-insurer'
    | 'agency'

const REPORT_OPTIONS: { value: ReportType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'todas', label: 'Todas las aseguradoras', icon: ShieldCheck },
    { value: 'insurer', label: 'Por Aseguradora', icon: Shield },
    { value: 'group-insurer', label: 'Por Grupo', icon: Briefcase },
    { value: 'agency-insurer', label: 'Por Agencia', icon: Building2 },
]

/* ═══════════════════════════════════════════════════════════════════════
   Mock data — per insurer
   ═══════════════════════════════════════════════════════════════════════ */

type Insurer = {
    id: string
    name: string
    initials: string
    color: string
    metrics: Metrics
}

const INSURERS: Insurer[] = [
    { id: 'gnp', name: 'GNP Seguros', initials: 'GNP', color: '#005F4A', metrics: { prima: 498500, comision: 69790, bonoInicial: 9970, bonoSiniestral: 7478, bonoRenovacion: 14955, bonoCartera: 4985, bonoIntegral: 12463, udi: 5583, intervita: 13958, nova: 6979, polizas: 52 } },
    { id: 'chubb', name: 'CHUBB', initials: 'CH', color: '#002855', metrics: { prima: 425000, comision: 63750, bonoInicial: 8500, bonoSiniestral: 6375, bonoRenovacion: 12750, bonoCartera: 4250, bonoIntegral: 10625, udi: 5100, intervita: 12750, nova: 6375, polizas: 34 } },
    { id: 'hdi', name: 'HDI Seguros', initials: 'HDI', color: '#006341', metrics: { prima: 334200, comision: 46788, bonoInicial: 6684, bonoSiniestral: 5013, bonoRenovacion: 10026, bonoCartera: 3342, bonoIntegral: 8355, udi: 3743, intervita: 9358, nova: 4679, polizas: 28 } },
    { id: 'qualitas', name: 'Quálitas', initials: 'QU', color: '#CC0000', metrics: { prima: 548700, comision: 71331, bonoInicial: 10974, bonoSiniestral: 8231, bonoRenovacion: 16461, bonoCartera: 5487, bonoIntegral: 13718, udi: 5707, intervita: 14266, nova: 7133, polizas: 61 } },
    { id: 'mapfre', name: 'Mapfre', initials: 'MA', color: '#E30613', metrics: { prima: 189400, comision: 22728, bonoInicial: 3788, bonoSiniestral: 2841, bonoRenovacion: 5682, bonoCartera: 1894, bonoIntegral: 4735, udi: 1818, intervita: 4546, nova: 2273, polizas: 19 } },
    { id: 'zurich', name: 'Zurich', initials: 'ZU', color: '#003399', metrics: { prima: 276100, comision: 38654, bonoInicial: 5522, bonoSiniestral: 4142, bonoRenovacion: 8283, bonoCartera: 2761, bonoIntegral: 6903, udi: 3092, intervita: 7731, nova: 3865, polizas: 22 } },
    { id: 'axa', name: 'AXA', initials: 'AXA', color: '#00008F', metrics: { prima: 612300, comision: 97968, bonoInicial: 12246, bonoSiniestral: 9185, bonoRenovacion: 18369, bonoCartera: 6123, bonoIntegral: 15308, udi: 7837, intervita: 19594, nova: 9797, polizas: 45 } },
]

const GROUPS = ['Grupo Automotriz del Norte', 'Grupo Premium Motors', 'Grupo Centro Occidente', 'Grupo Península', 'Grupo Bajío Motors']

const GROUP_WEIGHTS: Record<string, number> = {
    'Grupo Automotriz del Norte': 0.28,
    'Grupo Premium Motors': 0.24,
    'Grupo Centro Occidente': 0.26,
    'Grupo Península': 0.12,
    'Grupo Bajío Motors': 0.10,
}

const AGENCIES_BY_GROUP: Record<string, string[]> = {
    'Grupo Automotriz del Norte': ['Toyota Monterrey', 'Honda San Pedro', 'Nissan Apodaca', 'VW Cumbres'],
    'Grupo Premium Motors': ['Mazda Polanco', 'Toyota Santa Fe', 'Hyundai Satélite'],
    'Grupo Centro Occidente': ['Chevrolet Guadalajara', 'Ford Zapopan', 'Kia Tonalá', 'Nissan Tlajomulco', 'Honda Providencia'],
    'Grupo Península': ['Toyota Mérida', 'VW Cancún'],
    'Grupo Bajío Motors': ['Honda León', 'Mazda Querétaro'],
}

/* ═══════════════════════════════════════════════════════════════════════
   Derived helpers
   ═══════════════════════════════════════════════════════════════════════ */

const emptyMetrics = (): Metrics => ({
    prima: 0, comision: 0, bonoInicial: 0, bonoSiniestral: 0, bonoRenovacion: 0,
    bonoCartera: 0, bonoIntegral: 0, udi: 0, intervita: 0, nova: 0, polizas: 0,
})

function scaleMetrics(m: Metrics, factor: number): Metrics {
    return {
        prima: Math.round(m.prima * factor),
        comision: Math.round(m.comision * factor),
        bonoInicial: Math.round(m.bonoInicial * factor),
        bonoSiniestral: Math.round(m.bonoSiniestral * factor),
        bonoRenovacion: Math.round(m.bonoRenovacion * factor),
        bonoCartera: Math.round(m.bonoCartera * factor),
        bonoIntegral: Math.round(m.bonoIntegral * factor),
        udi: Math.round(m.udi * factor),
        intervita: Math.round(m.intervita * factor),
        nova: Math.round(m.nova * factor),
        polizas: Math.round(m.polizas * factor),
    }
}

function addMetrics(a: Metrics, b: Metrics): Metrics {
    return {
        prima: a.prima + b.prima,
        comision: a.comision + b.comision,
        bonoInicial: a.bonoInicial + b.bonoInicial,
        bonoSiniestral: a.bonoSiniestral + b.bonoSiniestral,
        bonoRenovacion: a.bonoRenovacion + b.bonoRenovacion,
        bonoCartera: a.bonoCartera + b.bonoCartera,
        bonoIntegral: a.bonoIntegral + b.bonoIntegral,
        udi: a.udi + b.udi,
        intervita: a.intervita + b.intervita,
        nova: a.nova + b.nova,
        polizas: a.polizas + b.polizas,
    }
}

function sumIngreso(m: Metrics): number {
    return m.comision + m.bonoInicial + m.bonoSiniestral + m.bonoRenovacion + m.bonoCartera + m.bonoIntegral + m.udi
}

const totalAll = INSURERS.reduce((acc, i) => addMetrics(acc, i.metrics), emptyMetrics())

/* ─── Date range scaling (timestamp-based mock) ─────────────────
   Las métricas se tratan como acumulado anual (~365 días).
   Cada mes de los últimos 12 tiene un peso para simular estacionalidad.
   El factor se calcula como: días ponderados en rango / días ponderados en año completo.
────────────────────────────────────────────────────────────────── */

const MONTHLY_WEIGHTS = [0.82, 0.88, 1.05, 1.18, 1.12, 0.95, 0.92, 1.04, 1.10, 0.98, 0.86, 1.10]

function getRangeFactor(from: Date, to: Date): number {
    if (!from || !to || to < from) return 0
    const today = new Date()
    const baseYear = today.getFullYear()
    const baseMonth = today.getMonth()
    let weightedRange = 0
    let weightedYear = 0
    for (let i = 0; i < 12; i++) {
        const mStart = new Date(baseYear, baseMonth - 11 + i, 1)
        const mEnd = new Date(baseYear, baseMonth - 11 + i + 1, 0, 23, 59, 59)
        const monthDays = mEnd.getDate()
        const w = MONTHLY_WEIGHTS[i]
        weightedYear += monthDays * w
        const overlapStart = mStart < from ? from : mStart
        const overlapEnd = mEnd > to ? to : mEnd
        if (overlapEnd >= overlapStart) {
            const days = Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / 86400000) + 1
            weightedRange += days * w
        }
    }
    return weightedYear > 0 ? weightedRange / weightedYear : 0
}

function scaleRow(row: RowData, factor: number): RowData {
    return {
        ...row,
        metrics: scaleMetrics(row.metrics, factor),
        children: row.children?.map(c => scaleRow(c, factor)),
    }
}

/* ═══════════════════════════════════════════════════════════════════════
   Formatters
   ═══════════════════════════════════════════════════════════════════════ */

const formatMXN = (n: number) => '$' + Math.round(n).toLocaleString('es-MX')
const formatMXNWithUnit = (n: number) => formatMXN(n) + ' MXN'

/* ═══════════════════════════════════════════════════════════════════════
   Shared UI blocks
   ═══════════════════════════════════════════════════════════════════════ */

function MetricsGrid({ m }: { m: Metrics }) {
    const ingreso = sumIngreso(m)

    const tiles: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; tint: string; highlight?: boolean }[] = [
        { label: 'Prima', value: formatMXNWithUnit(m.prima), icon: DollarSign, tint: 'text-accent bg-accent/10' },
        { label: 'Comisión', value: formatMXNWithUnit(m.comision), icon: Wallet, tint: 'text-success bg-success/10' },
        { label: 'Bono Inicial', value: formatMXNWithUnit(m.bonoInicial), icon: Gift, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Siniestral', value: formatMXNWithUnit(m.bonoSiniestral), icon: Shield, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Renovación', value: formatMXNWithUnit(m.bonoRenovacion), icon: TrendingUp, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Cartera', value: formatMXNWithUnit(m.bonoCartera), icon: Award, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Integral', value: formatMXNWithUnit(m.bonoIntegral), icon: Award, tint: 'text-warning bg-warning/10' },
        { label: 'UDI', value: formatMXNWithUnit(m.udi), icon: TrendingUp, tint: 'text-accent bg-accent/10' },
        { label: 'Número de Pólizas', value: m.polizas.toLocaleString('es-MX'), icon: FileText, tint: 'text-primary bg-primary/10' },
    ]

    tiles.push(
        { label: 'Ingreso', value: formatMXNWithUnit(ingreso), icon: DollarSign, tint: 'text-success bg-success/10', highlight: true },
    )

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tiles.map(t => {
                const Icon = t.icon
                return (
                    <Card key={t.label} className={cn('shadow-sm', t.highlight && 'border-2 border-primary/20')}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className={cn('p-1.5 rounded-md', t.tint)}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">{t.label}</p>
                            </div>
                            <p className={cn('font-bold text-primary', t.highlight ? 'text-xl' : 'text-lg')}>{t.value}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

type RowData = { id: string; name: string; logoId?: string; color?: string; initials?: string; metrics: Metrics; participation: number; children?: RowData[] }

function FullTable({
    rows,
    firstColLabel,
    searchable = false,
    paginated = false,
    pageSize = 5,
    searchPlaceholder = 'Buscar...',
    search,
    onSearchChange,
}: {
    rows: RowData[]
    firstColLabel: string
    searchable?: boolean
    paginated?: boolean
    pageSize?: number
    searchPlaceholder?: string
    search: string
    onSearchChange: (v: string) => void
}) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [breakdownExpanded, setBreakdownExpanded] = useState<Set<string>>(new Set())
    const [page, setPage] = useState(1)

    function toggle(id: string) {
        setExpanded(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function toggleBreakdown(id: string) {
        setBreakdownExpanded(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    // Filter rows by search query (matches top-level row name OR any child name)
    const filtered = useMemo(() => {
        if (!searchable || !search.trim()) return rows
        const q = search.toLowerCase().trim()
        return rows.filter(r =>
            r.name.toLowerCase().includes(q) ||
            (r.children?.some(c => c.name.toLowerCase().includes(q)) ?? false)
        )
    }, [rows, search, searchable])

    // Reset page when search changes
    useMemo(() => setPage(1), [search, rows])

    const totalPages = paginated ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1
    const currentPage = Math.min(page, totalPages)
    const startIdx = (currentPage - 1) * pageSize
    const visible = paginated ? filtered.slice(startIdx, startIdx + pageSize) : filtered

    return (
        <div className="space-y-3">
            {searchable && (
                <div className="px-4 pt-3">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-9 bg-white"
                        />
                    </div>
                </div>
            )}

            <div className="rounded-xl border bg-white overflow-x-auto mx-4">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="sticky left-0 bg-slate-50 min-w-[220px]">{firstColLabel}</TableHead>
                            <TableHead className="text-right">Ingreso</TableHead>
                            <TableHead className="text-right">Prima</TableHead>
                            <TableHead className="text-center">Pólizas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                                    Sin resultados
                                </TableCell>
                            </TableRow>
                        ) : (
                            visible.map(r => (
                                <RenderRow key={r.id} row={r} expanded={expanded} toggle={toggle} breakdownExpanded={breakdownExpanded} toggleBreakdown={toggleBreakdown} depth={0} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {paginated && filtered.length > pageSize && (
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                    <p className="text-xs text-muted-foreground">
                        Mostrando <span className="font-semibold">{startIdx + 1}</span>–
                        <span className="font-semibold">{Math.min(startIdx + pageSize, filtered.length)}</span> de{' '}
                        <span className="font-semibold">{filtered.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function RenderRow({
    row, expanded, toggle, breakdownExpanded, toggleBreakdown, depth,
}: {
    row: RowData
    expanded: Set<string>
    toggle: (id: string) => void
    breakdownExpanded: Set<string>
    toggleBreakdown: (id: string) => void
    depth: number
}) {
    const hasChildren = !!row.children && row.children.length > 0
    const isOpen = expanded.has(row.id)
    const isBreakdownOpen = breakdownExpanded.has(row.id)
    const ingresoTotal = sumIngreso(row.metrics)

    return (
        <>
            <TableRow
                className={cn('hover:bg-slate-50/50', depth > 0 && 'bg-slate-50/30', hasChildren && 'cursor-pointer')}
                onClick={() => hasChildren && toggle(row.id)}
            >
                <TableCell className={cn('sticky left-0 bg-white', depth > 0 && 'bg-slate-50/30')} style={{ paddingLeft: 16 + depth * 20 }}>
                    <div className="flex items-center gap-2">
                        {hasChildren && (
                            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', isOpen && 'rotate-180')} />
                        )}
                        {row.color && row.initials && (
                            <InsurerLogo
                                insurerId={row.logoId ?? row.id}
                                name={row.name}
                                initials={row.initials}
                                color={row.color}
                                size="xs"
                            />
                        )}
                        <span className="font-medium text-primary text-sm">{row.name}</span>
                    </div>
                </TableCell>
                <TableCell
                    className="text-right cursor-pointer select-none"
                    onClick={(e) => { e.stopPropagation(); toggleBreakdown(row.id) }}
                >
                    <div className="flex items-center justify-end gap-1.5">
                        <span className="font-bold text-primary">{formatMXN(ingresoTotal)}</span>
                        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0', isBreakdownOpen && 'rotate-180')} />
                    </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">{formatMXN(row.metrics.prima)}</TableCell>
                <TableCell className="text-center font-medium">{row.metrics.polizas}</TableCell>
            </TableRow>
            {isBreakdownOpen && (
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell colSpan={4} className="py-3 px-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3">
                            {[
                                { label: 'Comisión', value: row.metrics.comision },
                                { label: 'Bono Inicial', value: row.metrics.bonoInicial },
                                { label: 'Bono Siniestral', value: row.metrics.bonoSiniestral },
                                { label: 'Bono Renovación', value: row.metrics.bonoRenovacion },
                                { label: 'Bono Cartera', value: row.metrics.bonoCartera },
                                { label: 'Bono Integral', value: row.metrics.bonoIntegral },
                                { label: 'UDI', value: row.metrics.udi },
                                { label: 'Partner', value: row.metrics.intervita, accent: true },
                                { label: 'NOVA', value: row.metrics.nova, accent: true },
                            ].map(item => (
                                <div key={item.label} className={cn('flex flex-col gap-0.5', item.accent && 'border-l-2 border-primary/30 pl-2')}>
                                    <span className={cn('text-[10px] font-medium uppercase tracking-wide', item.accent ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
                                    <span className={cn('text-sm font-semibold', item.accent ? 'text-primary' : 'text-primary')}>{formatMXN(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </TableCell>
                </TableRow>
            )}
            {isOpen && row.children?.map(c => (
                <RenderRow key={c.id} row={c} expanded={expanded} toggle={toggle} breakdownExpanded={breakdownExpanded} toggleBreakdown={toggleBreakdown} depth={depth + 1} />
            ))}
        </>
    )
}

/* ═══════════════════════════════════════════════════════════════════════
   Report builders
   ═══════════════════════════════════════════════════════════════════════ */

function buildInsurerRows(): RowData[] {
    const totalPrima = totalAll.prima
    return INSURERS.map(ins => ({
        id: ins.id,
        logoId: ins.id,
        name: ins.name,
        color: ins.color,
        initials: ins.initials,
        metrics: ins.metrics,
        participation: (ins.metrics.prima / totalPrima) * 100,
    }))
}

function buildGroupRows(): RowData[] {
    const totalPrima = totalAll.prima
    return GROUPS.map(group => {
        const weight = GROUP_WEIGHTS[group]
        const metrics = scaleMetrics(totalAll, weight)
        return {
            id: `group-${group}`,
            name: group,
            metrics,
            participation: (metrics.prima / totalPrima) * 100,
        }
    })
}

function buildGroupInsurerRows(): RowData[] {
    const totalPrima = totalAll.prima
    return GROUPS.map(group => {
        const weight = GROUP_WEIGHTS[group]
        const groupMetrics = scaleMetrics(totalAll, weight)
        const children: RowData[] = INSURERS.map(ins => {
            const m = scaleMetrics(ins.metrics, weight)
            return {
                id: `${group}-${ins.id}`,
                logoId: ins.id,
                name: ins.name,
                color: ins.color,
                initials: ins.initials,
                metrics: m,
                participation: (m.prima / groupMetrics.prima) * 100,
            }
        })
        return {
            id: `group-${group}`,
            name: group,
            metrics: groupMetrics,
            participation: (groupMetrics.prima / totalPrima) * 100,
            children,
        }
    })
}

function buildAgencyRows(): RowData[] {
    const totalPrima = totalAll.prima
    // Split each group's metrics equally among its agencies
    const rows: RowData[] = []
    GROUPS.forEach(group => {
        const weight = GROUP_WEIGHTS[group]
        const groupMetrics = scaleMetrics(totalAll, weight)
        const agencies = AGENCIES_BY_GROUP[group] ?? []
        agencies.forEach(agencyName => {
            const m = scaleMetrics(groupMetrics, 1 / agencies.length)
            rows.push({
                id: `agency-${agencyName}`,
                name: `${agencyName}`,
                metrics: m,
                participation: (m.prima / totalPrima) * 100,
            })
        })
    })
    return rows
}

function buildAgencyInsurerRows(): RowData[] {
    const totalPrima = totalAll.prima
    const rows: RowData[] = []
    GROUPS.forEach(group => {
        const weight = GROUP_WEIGHTS[group]
        const groupMetrics = scaleMetrics(totalAll, weight)
        const agencies = AGENCIES_BY_GROUP[group] ?? []
        agencies.forEach(agencyName => {
            const m = scaleMetrics(groupMetrics, 1 / agencies.length)
            const children: RowData[] = INSURERS.map(ins => {
                const sub = scaleMetrics(ins.metrics, weight / agencies.length)
                return {
                    id: `${agencyName}-${ins.id}`,
                    logoId: ins.id,
                    name: ins.name,
                    color: ins.color,
                    initials: ins.initials,
                    metrics: sub,
                    participation: (sub.prima / m.prima) * 100,
                }
            })
            rows.push({
                id: `agency-${agencyName}`,
                name: agencyName,
                metrics: m,
                participation: (m.prima / totalPrima) * 100,
                children,
            })
        })
    })
    return rows
}

/* ═══════════════════════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════════════════════ */

export default function ReportsPage() {
    const [report, setReport] = useState<ReportType>('todas')

    const today = new Date()
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const [dateRange, setDateRange] = useState<DateRange>({ from: firstOfMonth, to: today })
    const [tableSearch, setTableSearch] = useState('')

    // Reset search cuando cambia el tipo de reporte
    useMemo(() => setTableSearch(''), [report])

    const factor = useMemo(
        () => getRangeFactor(dateRange.from, dateRange.to),
        [dateRange]
    )

    const scaledTotal = useMemo(
        () => scaleMetrics(totalAll, factor),
        [factor]
    )

    const data = useMemo(() => {
        const scaleRows = (rows: RowData[]) => rows.map(r => scaleRow(r, factor))

        switch (report) {
            case 'todas':
                return {
                    title: 'Todas las Aseguradoras',
                    description: 'Vista consolidada de todas las compañías.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: null as RowData[] | null,
                }
            case 'insurer':
                return {
                    title: 'Por Aseguradora',
                    description: 'Desglose por cada compañía de forma independiente.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: scaleRows(buildInsurerRows()),
                }
            case 'group':
                return {
                    title: 'Por Grupo',
                    description: 'Desglose por grupo de forma independiente.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: scaleRows(buildGroupRows()),
                }
            case 'group-insurer':
                return {
                    title: 'Por Grupo',
                    description: 'Cruce entre cada grupo y las aseguradoras con las que opera. Haz clic en un grupo para expandirlo.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: scaleRows(buildGroupInsurerRows()),
                }
            case 'agency':
                return {
                    title: 'Por Agencia',
                    description: 'Desglose por agencia de forma independiente.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: scaleRows(buildAgencyRows()),
                }
            case 'agency-insurer':
                return {
                    title: 'Por Agencia',
                    description: 'Cruce entre cada agencia y las aseguradoras. Haz clic en una agencia para expandirla.',
                    metrics: scaledTotal,
                    participation: 100,
                    rows: scaleRows(buildAgencyInsurerRows()),
                }
        }
    }, [report, factor, scaledTotal])

    function exportCsv() {
        const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
        const escape = (v: unknown) => {
            const s = String(v ?? '')
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }

        const headers = [
            'Tipo', 'Nivel', 'Entidad', 'Ingreso (MXN)',
            'Prima (MXN)', 'Pólizas',
            'Comisión (MXN)', 'Bono Inicial (MXN)', 'Bono Siniestral (MXN)',
            'Bono Renovación (MXN)', 'Bono Cartera (MXN)', 'Bono Integral (MXN)', 'UDI (MXN)',
            'Partner (MXN)', 'NOVA (MXN)',
        ]

        const lines: string[] = []
        lines.push(headers.map(escape).join(','))

        const reportLabel = REPORT_OPTIONS.find(r => r.value === report)?.label ?? report

        // Resumen total
        lines.push([
            reportLabel, 'Total', 'Todas las aseguradoras', sumIngreso(scaledTotal),
            scaledTotal.prima, scaledTotal.polizas,
            scaledTotal.comision, scaledTotal.bonoInicial, scaledTotal.bonoSiniestral,
            scaledTotal.bonoRenovacion, scaledTotal.bonoCartera, scaledTotal.bonoIntegral, scaledTotal.udi,
            scaledTotal.intervita, scaledTotal.nova,
        ].map(escape).join(','))

        // Filas (con hijos si aplica)
        function pushRow(r: RowData, level: 'Padre' | 'Hijo' = 'Padre') {
            lines.push([
                reportLabel, level, r.name, sumIngreso(r.metrics),
                r.metrics.prima, r.metrics.polizas,
                r.metrics.comision, r.metrics.bonoInicial, r.metrics.bonoSiniestral,
                r.metrics.bonoRenovacion, r.metrics.bonoCartera, r.metrics.bonoIntegral, r.metrics.udi,
                r.metrics.intervita, r.metrics.nova,
            ].map(escape).join(','))
            r.children?.forEach(c => pushRow(c, 'Hijo'))
        }

        // Apply current table search filter so export respects what's visible
        const q = tableSearch.toLowerCase().trim()
        const filteredRows = q
            ? (data?.rows ?? []).filter(r =>
                r.name.toLowerCase().includes(q) ||
                (r.children?.some(c => c.name.toLowerCase().includes(q)) ?? false)
            )
            : (data?.rows ?? [])

        filteredRows.forEach(r => pushRow(r))

        const csv = '﻿' + lines.join('\n')  // BOM para que Excel lea los acentos
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const filename = `reporte_${report}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.csv`
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                        Panel de Reportes
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-primary mt-1">
                        Reportes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Analiza primas, comisiones y bonos por diferentes agrupaciones.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <button
                        onClick={exportCsv}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-primary transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Report selector */}
            <div className="rounded-xl border bg-white p-2">
                <div className="flex flex-wrap gap-1.5">
                    {REPORT_OPTIONS.map(opt => {
                        const Icon = opt.icon
                        const active = report === opt.value
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setReport(opt.value)}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-muted-foreground hover:bg-slate-100 hover:text-primary'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {opt.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Indicadores: solo en la vista inicial "Todas las aseguradoras" */}
            {report === 'todas' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{data.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{data.description}</p>
                    </CardHeader>
                    <CardContent>
                        <MetricsGrid m={data.metrics} />
                    </CardContent>
                </Card>
            )}

            {/* Tabla detallada — visible en todos los demás filtros */}
            {data.rows && (
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">{data.title}</CardTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">{data.description}</p>
                            </div>
                            <span className="text-sm text-muted-foreground shrink-0">{data.rows.length} registros · Montos en MXN</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <FullTable
                            rows={data.rows}
                            firstColLabel={
                                report === 'insurer' ? 'Aseguradora'
                                    : report === 'group-insurer' ? 'Grupo / Aseguradora'
                                        : 'Agencia / Aseguradora'
                            }
                            searchable={report === 'group-insurer' || report === 'agency-insurer'}
                            paginated={report === 'group-insurer' || report === 'agency-insurer'}
                            pageSize={report === 'agency-insurer' ? 8 : 5}
                            searchPlaceholder={
                                report === 'group-insurer' ? 'Buscar grupo...'
                                    : 'Buscar agencia...'
                            }
                            search={tableSearch}
                            onSearchChange={setTableSearch}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
