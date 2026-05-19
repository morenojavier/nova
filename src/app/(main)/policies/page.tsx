'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { InsurerLogo } from '@/components/ui/insurer-logo'
import { Search, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type PolicyStatus = 'Vigente' | 'Por Vencer' | 'Vencida'
type ClientType = 'Contratante' | 'Asegurado'
type TabId = 'polizas' | 'comisiones'

interface Policy {
    id: string
    policyNumber: string
    client: string
    clientType: ClientType
    insurer: string
    planType: string
    startDate: string
    endDate: string
    annualPremium: string
    annualPremiumRaw: number
    status: PolicyStatus
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const policies: Policy[] = [
    {
        id: '1',
        policyNumber: 'CHB-2024-001847',
        client: 'Carlos Rivas Montoya',
        clientType: 'Contratante',
        insurer: 'CHUBB',
        planType: 'Auto Amplia',
        startDate: '15/04/2024',
        endDate: '15/04/2025',
        annualPremium: '$12,500',
        annualPremiumRaw: 12500,
        status: 'Por Vencer',
    },
    {
        id: '2',
        policyNumber: 'AXA-2024-003291',
        client: 'Empresa Logistics SA de CV',
        clientType: 'Contratante',
        insurer: 'AXA',
        planType: 'Flotilla Plus',
        startDate: '01/01/2024',
        endDate: '31/12/2024',
        annualPremium: '$48,000',
        annualPremiumRaw: 48000,
        status: 'Vencida',
    },
    {
        id: '3',
        policyNumber: 'HDI-2025-007412',
        client: 'Ana Martínez Herrera',
        clientType: 'Asegurado',
        insurer: 'HDI',
        planType: 'Auto Amplia Plus',
        startDate: '10/03/2025',
        endDate: '10/03/2026',
        annualPremium: '$15,800',
        annualPremiumRaw: 15800,
        status: 'Vigente',
    },
    {
        id: '4',
        policyNumber: 'QUA-2025-002156',
        client: 'Roberto Gómez Salinas',
        clientType: 'Asegurado',
        insurer: 'Quálitas',
        planType: 'Auto Base',
        startDate: '22/06/2025',
        endDate: '22/06/2026',
        annualPremium: '$8,900',
        annualPremiumRaw: 8900,
        status: 'Vigente',
    },
    {
        id: '5',
        policyNumber: 'CHB-2024-009834',
        client: 'María Fernández Torres',
        clientType: 'Contratante',
        insurer: 'CHUBB',
        planType: 'Auto Base',
        startDate: '05/05/2024',
        endDate: '05/05/2025',
        annualPremium: '$9,200',
        annualPremiumRaw: 9200,
        status: 'Por Vencer',
    },
    {
        id: '6',
        policyNumber: 'AXA-2023-011220',
        client: 'Transportes Rápidos del Norte',
        clientType: 'Contratante',
        insurer: 'AXA',
        planType: 'Equipo Pesado',
        startDate: '15/07/2023',
        endDate: '15/07/2024',
        annualPremium: '$62,400',
        annualPremiumRaw: 62400,
        status: 'Vencida',
    },
    {
        id: '7',
        policyNumber: 'MAP-2025-004871',
        client: 'Lucía Reyes Castillo',
        clientType: 'Asegurado',
        insurer: 'Mapfre',
        planType: 'Vida Temporaria',
        startDate: '01/02/2025',
        endDate: '01/02/2026',
        annualPremium: '$6,300',
        annualPremiumRaw: 6300,
        status: 'Vigente',
    },
    {
        id: '8',
        policyNumber: 'HDI-2025-006603',
        client: 'Jorge Villanueva Paz',
        clientType: 'Asegurado',
        insurer: 'HDI',
        planType: 'Gastos Médicos Mayores',
        startDate: '18/01/2025',
        endDate: '18/01/2026',
        annualPremium: '$22,750',
        annualPremiumRaw: 22750,
        status: 'Vigente',
    },
    {
        id: '9',
        policyNumber: 'QUA-2024-008390',
        client: 'Sofía Delgado Ríos',
        clientType: 'Contratante',
        insurer: 'Quálitas',
        planType: 'Auto Amplia',
        startDate: '30/04/2024',
        endDate: '30/04/2025',
        annualPremium: '$11,100',
        annualPremiumRaw: 11100,
        status: 'Por Vencer',
    },
    {
        id: '10',
        policyNumber: 'MAP-2025-001045',
        client: 'Construcciones Vargas e Hijos',
        clientType: 'Contratante',
        insurer: 'Mapfre',
        planType: 'Responsabilidad Civil',
        startDate: '12/09/2025',
        endDate: '12/09/2026',
        annualPremium: '$34,600',
        annualPremiumRaw: 34600,
        status: 'Vigente',
    },
    {
        id: '11',
        policyNumber: 'ZUR-2025-003310',
        client: 'Patricia Núñez Ibarra',
        clientType: 'Asegurado',
        insurer: 'Zurich',
        planType: 'Hogar Plus',
        startDate: '20/03/2025',
        endDate: '20/03/2026',
        annualPremium: '$18,400',
        annualPremiumRaw: 18400,
        status: 'Vigente',
    },
    {
        id: '12',
        policyNumber: 'ZUR-2024-007829',
        client: 'Distribuidora El Sol SA',
        clientType: 'Contratante',
        insurer: 'Zurich',
        planType: 'Responsabilidad Civil',
        startDate: '10/06/2024',
        endDate: '10/06/2025',
        annualPremium: '$41,200',
        annualPremiumRaw: 41200,
        status: 'Por Vencer',
    },
]

// ─── Comisiones Config ────────────────────────────────────────────────────────

interface InsurerCommission {
    name: string
    initials: string
    color: string
    commissionPct: number
}

const INSURER_COMMISSIONS: InsurerCommission[] = [
    { name: 'GNP Seguros', initials: 'GNP', color: '#FF6D00', commissionPct: 14 },
    { name: 'CHUBB',       initials: 'CH',  color: '#002855', commissionPct: 15 },
    { name: 'HDI',         initials: 'HDI', color: '#006341', commissionPct: 14 },
    { name: 'Quálitas',    initials: 'QU',  color: '#6A0DAD', commissionPct: 12 },
    { name: 'Mapfre',      initials: 'MA',  color: '#E30613', commissionPct: 18 },
    { name: 'Zurich',      initials: 'ZU',  color: '#003399', commissionPct: 16 },
    { name: 'AXA',         initials: 'AXA', color: '#00008F', commissionPct: 13 },
]

const PRIMA_GOAL = 3_000_000
const PRIMA_BONUS = 45_000

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['Todas', 'Vigente', 'Por Vencer', 'Vencida'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const TABS: { id: TabId; label: string }[] = [
    { id: 'polizas',     label: 'Pólizas' },
    { id: 'comisiones',  label: 'Comisiones' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PolicyStatus }) {
    return (
        <Badge
            className={cn(
                'font-medium',
                status === 'Vigente'    && 'bg-success hover:bg-success text-white',
                status === 'Por Vencer' && 'bg-warning hover:bg-warning text-white',
                status === 'Vencida'    && 'bg-destructive/10 hover:bg-destructive/20 text-destructive border-transparent'
            )}
            variant={status === 'Vencida' ? 'outline' : 'default'}
        >
            {status}
        </Badge>
    )
}

function ClientTypeBadge({ type }: { type: ClientType }) {
    return (
        <Badge
            className={cn(
                'font-medium',
                type === 'Contratante' && 'bg-primary hover:bg-primary text-white',
                type === 'Asegurado'   && 'bg-accent hover:bg-accent text-white',
            )}
        >
            {type}
        </Badge>
    )
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

// ─── Comisiones Tab ───────────────────────────────────────────────────────────

function ComisionesTab() {
    const stats = useMemo(() => {
        return INSURER_COMMISSIONS.map((cfg) => {
            // Normalize insurer name for comparison (handles "Qualitas" / "Quálitas")
            const matchName = cfg.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const insurerPolicies = policies.filter((p) => {
                const pName = p.insurer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                return pName === matchName
            })
            const activeCount  = insurerPolicies.filter((p) => p.status === 'Vigente').length
            const totalPremium = insurerPolicies.reduce((sum, p) => sum + p.annualPremiumRaw, 0)
            const commission   = Math.round(totalPremium * (cfg.commissionPct / 100))
            return { ...cfg, activeCount, totalPremium, commission }
        })
    }, [])

    const totalPrima = useMemo(
        () => policies.reduce((sum, p) => sum + p.annualPremiumRaw, 0),
        []
    )

    const progressPct = Math.min((totalPrima / PRIMA_GOAL) * 100, 100)

    return (
        <div className="space-y-6">
            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <Card key={s.name} className="overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-4">
                                <InsurerLogo
                                    insurerId={s.name}
                                    name={s.name}
                                    initials={s.initials}
                                    color={s.color}
                                    size="md"
                                />
                                <div>
                                    <p className="font-semibold text-foreground leading-tight">
                                        {s.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {s.activeCount} póliza{s.activeCount !== 1 ? 's' : ''} activa{s.activeCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Prima total</span>
                                    <span className="font-medium">{formatCurrency(s.totalPremium)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Comisión</span>
                                    <span className="font-medium text-primary">{s.commissionPct}%</span>
                                </div>
                                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                                    <span className="text-muted-foreground font-medium">Comisión ganada</span>
                                    <span className="font-bold text-primary">{formatCurrency(s.commission)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Meta de Primas */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Meta de Primas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(totalPrima)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                de {formatCurrency(PRIMA_GOAL)} objetivo
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-foreground">
                                {progressPct.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">alcanzado</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div
                        className="w-full h-3 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={Math.round(progressPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progreso hacia meta de primas"
                    >
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>

                    <p className="text-sm text-muted-foreground pt-1">
                        Bono al alcanzar meta:{' '}
                        <span className="font-semibold text-foreground">
                            {formatCurrency(PRIMA_BONUS)}
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
    const [activeTab, setActiveTab]       = useState<TabId>('polizas')
    const [search, setSearch]             = useState('')
    const [activeFilter, setActiveFilter] = useState<StatusFilter>('Todas')

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()

        return policies.filter((p) => {
            const matchesStatus =
                activeFilter === 'Todas' || p.status === activeFilter

            const matchesSearch =
                !q ||
                p.policyNumber.toLowerCase().includes(q) ||
                p.client.toLowerCase().includes(q) ||
                p.insurer.toLowerCase().includes(q) ||
                p.planType.toLowerCase().includes(q) ||
                p.status.toLowerCase().includes(q) ||
                p.clientType.toLowerCase().includes(q)

            return matchesStatus && matchesSearch
        })
    }, [search, activeFilter])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Pólizas
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Administra la cartera de pólizas y haz seguimiento de las próximas a vencer.
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 shrink-0">
                    + Nueva Póliza
                </Button>
            </div>

            {/* Tab bar */}
            <div
                className="flex gap-1 border-b"
                role="tablist"
                aria-label="Secciones de pólizas"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-md',
                            activeTab === tab.id
                                ? 'border-b-2 border-primary text-primary -mb-px bg-transparent'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            <div
                id="panel-polizas"
                role="tabpanel"
                aria-labelledby="tab-polizas"
                hidden={activeTab !== 'polizas'}
            >
                {activeTab === 'polizas' && (
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle>Todas las pólizas</CardTitle>
                                    {/* Search */}
                                    <div className="relative w-full sm:w-72">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar por cliente, no. póliza, aseguradora..."
                                            className="pl-8 bg-white"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            aria-label="Buscar pólizas"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter Badges */}
                                <div
                                    className="flex flex-wrap gap-2"
                                    role="group"
                                    aria-label="Filtrar por estatus"
                                >
                                    {STATUS_FILTERS.map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            aria-pressed={activeFilter === filter}
                                            className={cn(
                                                'inline-flex items-center rounded-full px-3.5 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                                activeFilter === filter
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                            )}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>No. Póliza</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Tipo de Cliente</TableHead>
                                            <TableHead>Aseguradora</TableHead>
                                            <TableHead>Tipo de plan</TableHead>
                                            <TableHead>Vigencia</TableHead>
                                            <TableHead>Prima anual</TableHead>
                                            <TableHead>Estatus</TableHead>
                                            <TableHead className="w-[50px]">
                                                <span className="sr-only">Acciones</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={9}
                                                    className="h-32 text-center text-muted-foreground"
                                                >
                                                    No se encontraron pólizas con los filtros aplicados.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filtered.map((policy) => (
                                                <TableRow
                                                    key={policy.id}
                                                    className="hover:bg-slate-50/50"
                                                >
                                                    <TableCell className="font-mono text-sm font-medium">
                                                        {policy.policyNumber}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {policy.client}
                                                    </TableCell>
                                                    <TableCell>
                                                        <ClientTypeBadge type={policy.clientType} />
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {policy.insurer}
                                                    </TableCell>
                                                    <TableCell>{policy.planType}</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{policy.startDate}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {policy.endDate}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-primary">
                                                        {policy.annualPremium}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={policy.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground"
                                                            aria-label={`Acciones para póliza ${policy.policyNumber}`}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Footer count */}
                            {filtered.length > 0 && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Mostrando{' '}
                                    <span className="font-semibold text-foreground">
                                        {filtered.length}
                                    </span>{' '}
                                    de{' '}
                                    <span className="font-semibold text-foreground">
                                        {policies.length}
                                    </span>{' '}
                                    pólizas
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div
                id="panel-comisiones"
                role="tabpanel"
                aria-labelledby="tab-comisiones"
                hidden={activeTab !== 'comisiones'}
            >
                {activeTab === 'comisiones' && <ComisionesTab />}
            </div>
        </div>
    )
}
