'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    DollarSign, Wallet, Gift, TrendingUp, Shield, FileText, Percent,
    Award, ChevronDown, Building2, Briefcase, ShieldCheck, Download,
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
    { value: 'group', label: 'Por Grupo', icon: Briefcase },
    { value: 'group-insurer', label: 'Por Grupo × Aseguradora', icon: Briefcase },
    { value: 'agency', label: 'Por Agencia', icon: Building2 },
    { value: 'agency-insurer', label: 'Por Agencia × Aseguradora', icon: Building2 },
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
    { id: 'gnp', name: 'GNP Seguros', initials: 'GNP', color: '#005F4A', metrics: { prima: 498500, comision: 69790, bonoInicial: 9970, bonoSiniestral: 7478, bonoRenovacion: 14955, bonoCartera: 4985, bonoIntegral: 12463, polizas: 52 } },
    { id: 'chubb', name: 'CHUBB', initials: 'CH', color: '#002855', metrics: { prima: 425000, comision: 63750, bonoInicial: 8500, bonoSiniestral: 6375, bonoRenovacion: 12750, bonoCartera: 4250, bonoIntegral: 10625, polizas: 34 } },
    { id: 'hdi', name: 'HDI Seguros', initials: 'HDI', color: '#006341', metrics: { prima: 334200, comision: 46788, bonoInicial: 6684, bonoSiniestral: 5013, bonoRenovacion: 10026, bonoCartera: 3342, bonoIntegral: 8355, polizas: 28 } },
    { id: 'qualitas', name: 'Quálitas', initials: 'QU', color: '#CC0000', metrics: { prima: 548700, comision: 71331, bonoInicial: 10974, bonoSiniestral: 8231, bonoRenovacion: 16461, bonoCartera: 5487, bonoIntegral: 13718, polizas: 61 } },
    { id: 'mapfre', name: 'Mapfre', initials: 'MA', color: '#E30613', metrics: { prima: 189400, comision: 22728, bonoInicial: 3788, bonoSiniestral: 2841, bonoRenovacion: 5682, bonoCartera: 1894, bonoIntegral: 4735, polizas: 19 } },
    { id: 'zurich', name: 'Zurich', initials: 'ZU', color: '#003399', metrics: { prima: 276100, comision: 38654, bonoInicial: 5522, bonoSiniestral: 4142, bonoRenovacion: 8283, bonoCartera: 2761, bonoIntegral: 6903, polizas: 22 } },
    { id: 'axa', name: 'AXA', initials: 'AXA', color: '#00008F', metrics: { prima: 612300, comision: 97968, bonoInicial: 12246, bonoSiniestral: 9185, bonoRenovacion: 18369, bonoCartera: 6123, bonoIntegral: 15308, polizas: 45 } },
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
    bonoCartera: 0, bonoIntegral: 0, polizas: 0,
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
        polizas: a.polizas + b.polizas,
    }
}

function sumBonos(m: Metrics): number {
    return m.bonoInicial + m.bonoSiniestral + m.bonoRenovacion + m.bonoCartera + m.bonoIntegral
}

function sumBonosComision(m: Metrics): number {
    return sumBonos(m) + m.comision
}

const totalAll = INSURERS.reduce((acc, i) => addMetrics(acc, i.metrics), emptyMetrics())

/* ═══════════════════════════════════════════════════════════════════════
   Formatters
   ═══════════════════════════════════════════════════════════════════════ */

const formatMXN = (n: number) => '$' + Math.round(n).toLocaleString('es-MX')
const formatMXNWithUnit = (n: number) => formatMXN(n) + ' MXN'
const formatPct = (n: number) => n.toFixed(1) + '%'

/* ═══════════════════════════════════════════════════════════════════════
   Shared UI blocks
   ═══════════════════════════════════════════════════════════════════════ */

function MetricsGrid({ m, participation }: { m: Metrics; participation?: number }) {
    const totalBonos = sumBonos(m)
    const totalBonosComm = sumBonosComision(m)

    const tiles: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; tint: string; highlight?: boolean }[] = [
        { label: 'Prima', value: formatMXNWithUnit(m.prima), icon: DollarSign, tint: 'text-accent bg-accent/10' },
        { label: 'Comisión', value: formatMXNWithUnit(m.comision), icon: Wallet, tint: 'text-success bg-success/10' },
        { label: 'Bono Inicial', value: formatMXNWithUnit(m.bonoInicial), icon: Gift, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Siniestral', value: formatMXNWithUnit(m.bonoSiniestral), icon: Shield, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Renovación', value: formatMXNWithUnit(m.bonoRenovacion), icon: TrendingUp, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Cartera', value: formatMXNWithUnit(m.bonoCartera), icon: Award, tint: 'text-warning bg-warning/10' },
        { label: 'Bono Integral', value: formatMXNWithUnit(m.bonoIntegral), icon: Award, tint: 'text-warning bg-warning/10' },
        { label: 'Número de Pólizas', value: m.polizas.toLocaleString('es-MX'), icon: FileText, tint: 'text-primary bg-primary/10' },
    ]

    if (participation !== undefined) {
        tiles.push({ label: 'Participación', value: formatPct(participation), icon: Percent, tint: 'text-primary bg-primary/10' })
    }

    tiles.push(
        { label: 'Σ Todos los Bonos', value: formatMXNWithUnit(totalBonos), icon: Award, tint: 'text-accent bg-accent/10', highlight: true },
        { label: 'Σ Bonos + Comisiones', value: formatMXNWithUnit(totalBonosComm), icon: DollarSign, tint: 'text-success bg-success/10', highlight: true },
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

type RowData = { id: string; name: string; color?: string; initials?: string; metrics: Metrics; participation: number; children?: RowData[] }

function FullTable({ rows, firstColLabel }: { rows: RowData[]; firstColLabel: string }) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    function toggle(id: string) {
        setExpanded(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div className="rounded-xl border bg-white overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="sticky left-0 bg-slate-50 min-w-[220px]">{firstColLabel}</TableHead>
                        <TableHead className="text-right">Prima</TableHead>
                        <TableHead className="text-right">Comisión</TableHead>
                        <TableHead className="text-right">B. Inicial</TableHead>
                        <TableHead className="text-right">B. Siniestral</TableHead>
                        <TableHead className="text-right">B. Renovación</TableHead>
                        <TableHead className="text-right">B. Cartera</TableHead>
                        <TableHead className="text-right">B. Integral</TableHead>
                        <TableHead className="text-center">Pólizas</TableHead>
                        <TableHead className="text-right">Participación</TableHead>
                        <TableHead className="text-right">Σ Bonos</TableHead>
                        <TableHead className="text-right">Σ Bonos+Com.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(r => (
                        <RenderRow key={r.id} row={r} expanded={expanded} toggle={toggle} depth={0} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function RenderRow({ row, expanded, toggle, depth }: { row: RowData; expanded: Set<string>; toggle: (id: string) => void; depth: number }) {
    const hasChildren = !!row.children && row.children.length > 0
    const isOpen = expanded.has(row.id)
    const bonosTotal = sumBonos(row.metrics)
    const bonosCommTotal = sumBonosComision(row.metrics)

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
                            <div
                                className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                                style={{ backgroundColor: row.color }}
                            >
                                {row.initials}
                            </div>
                        )}
                        <span className="font-medium text-primary text-sm">{row.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">{formatMXN(row.metrics.prima)}</TableCell>
                <TableCell className="text-right text-success font-medium">{formatMXN(row.metrics.comision)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMXN(row.metrics.bonoInicial)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMXN(row.metrics.bonoSiniestral)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMXN(row.metrics.bonoRenovacion)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMXN(row.metrics.bonoCartera)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMXN(row.metrics.bonoIntegral)}</TableCell>
                <TableCell className="text-center font-medium">{row.metrics.polizas}</TableCell>
                <TableCell className="text-right">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">{formatPct(row.participation)}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-accent">{formatMXN(bonosTotal)}</TableCell>
                <TableCell className="text-right font-bold text-primary">{formatMXN(bonosCommTotal)}</TableCell>
            </TableRow>
            {isOpen && row.children?.map(c => (
                <RenderRow key={c.id} row={c} expanded={expanded} toggle={toggle} depth={depth + 1} />
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

    const data = useMemo(() => {
        switch (report) {
            case 'todas':
                return {
                    title: 'Todas las Aseguradoras',
                    description: 'Vista consolidada de todas las compañías.',
                    metrics: totalAll,
                    participation: 100,
                    rows: null as RowData[] | null,
                }
            case 'insurer':
                return {
                    title: 'Por Aseguradora',
                    description: 'Desglose por cada compañía de forma independiente.',
                    metrics: totalAll,
                    participation: 100,
                    rows: buildInsurerRows(),
                }
            case 'group':
                return {
                    title: 'Por Grupo',
                    description: 'Desglose por grupo de forma independiente.',
                    metrics: totalAll,
                    participation: 100,
                    rows: buildGroupRows(),
                }
            case 'group-insurer':
                return {
                    title: 'Por Grupo × Aseguradora',
                    description: 'Cruce entre cada grupo y las aseguradoras con las que opera. Haz clic en un grupo para expandirlo.',
                    metrics: totalAll,
                    participation: 100,
                    rows: buildGroupInsurerRows(),
                }
            case 'agency':
                return {
                    title: 'Por Agencia',
                    description: 'Desglose por agencia de forma independiente.',
                    metrics: totalAll,
                    participation: 100,
                    rows: buildAgencyRows(),
                }
            case 'agency-insurer':
                return {
                    title: 'Por Agencia × Aseguradora',
                    description: 'Cruce entre cada agencia y las aseguradoras. Haz clic en una agencia para expandirla.',
                    metrics: totalAll,
                    participation: 100,
                    rows: buildAgencyInsurerRows(),
                }
        }
    }, [report])

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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-primary transition-colors">
                    <Download className="w-4 h-4" />
                    Exportar
                </button>
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

            {/* Report header */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{data.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                </CardHeader>
                <CardContent>
                    <MetricsGrid m={data.metrics} participation={data.participation} />
                </CardContent>
            </Card>

            {/* Detailed breakdown table */}
            {data.rows && (
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Desglose detallado</CardTitle>
                            <span className="text-sm text-muted-foreground">{data.rows.length} registros · Montos en MXN</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <FullTable
                            rows={data.rows}
                            firstColLabel={
                                report === 'insurer' ? 'Aseguradora'
                                    : report === 'group' ? 'Grupo'
                                        : report === 'group-insurer' ? 'Grupo / Aseguradora'
                                            : report === 'agency' ? 'Agencia'
                                                : 'Agencia / Aseguradora'
                            }
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
