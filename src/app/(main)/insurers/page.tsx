'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, MoreHorizontal, FileText, Users, TrendingUp, DollarSign, Wallet, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

type InsurerClient = {
    id: string
    client: string
    policyNumber: string
    planType: string
    vehicle: string
    premium: string
    startDate: string
    endDate: string
    status: 'Vigente' | 'Por Vencer' | 'Vencida'
}

type Insurer = {
    id: string
    name: string
    initials: string
    avatarBg: string
    policies: number
    renewalRate: number
    premium: number
    commission: number
    bonus: number
    clients: InsurerClient[]
}

const formatMXN = (n: number) => '$' + n.toLocaleString('es-MX') + ' MXN'

const insurers: Insurer[] = [
    {
        id: '7', name: 'GNP Seguros', initials: 'GNP', avatarBg: '#005F4A', policies: 52, renewalRate: 88,
        premium: 498500, commission: 69790, bonus: 24925,
        clients: [
            { id: 'g1', client: 'Alejandro Torres Morales', policyNumber: 'GNP-2025-001847', planType: 'Auto Amplia', vehicle: 'Honda Civic 2023', premium: '$12,500', startDate: '15/04/2025', endDate: '15/04/2026', status: 'Vigente' },
            { id: 'g2', client: 'María Fernández Jiménez', policyNumber: 'GNP-2025-009834', planType: 'Auto Base', vehicle: 'VW Jetta 2021', premium: '$9,200', startDate: '05/05/2025', endDate: '05/05/2026', status: 'Vigente' },
            { id: 'g3', client: 'Carlos Ramírez Gutiérrez', policyNumber: 'GNP-2024-007210', planType: 'Auto Limitada', vehicle: 'Nissan Sentra 2023', premium: '$5,100', startDate: '20/11/2024', endDate: '20/11/2025', status: 'Por Vencer' },
            { id: 'g4', client: 'Diego Martínez Flores', policyNumber: 'GNP-2024-008901', planType: 'Auto Amplia', vehicle: 'Kia Rio 2024', premium: '$7,900', startDate: '10/10/2024', endDate: '10/10/2025', status: 'Por Vencer' },
            { id: 'g5', client: 'Beatriz Aguilar Mendoza', policyNumber: 'GNP-2025-010245', planType: 'Vida Plus', vehicle: 'N/A', premium: '$18,400', startDate: '12/02/2025', endDate: '12/02/2026', status: 'Vigente' },
            { id: 'g6', client: 'Héctor Vázquez Ortega', policyNumber: 'GNP-2025-010560', planType: 'Auto Amplia Plus', vehicle: 'Mazda 3 2024', premium: '$16,200', startDate: '28/02/2025', endDate: '28/02/2026', status: 'Vigente' },
        ],
    },
    {
        id: '1', name: 'CHUBB', initials: 'CH', avatarBg: '#002855', policies: 34, renewalRate: 91,
        premium: 425000, commission: 63750, bonus: 21250,
        clients: [
            { id: 'c1', client: 'Roberto Gómez Salinas', policyNumber: 'CH-2025-004521', planType: 'Auto Amplia', vehicle: 'Nissan Versa 2024', premium: '$11,622', startDate: '01/03/2025', endDate: '01/03/2026', status: 'Vigente' },
            { id: 'c2', client: 'Laura Méndez Ríos', policyNumber: 'CH-2025-004530', planType: 'Auto Amplia Plus', vehicle: 'Toyota Corolla 2023', premium: '$14,800', startDate: '15/02/2025', endDate: '15/02/2026', status: 'Vigente' },
            { id: 'c3', client: 'Marcos Herrera Luna', policyNumber: 'CH-2024-003891', planType: 'Auto Base', vehicle: 'Chevrolet Aveo 2022', premium: '$7,200', startDate: '10/05/2024', endDate: '10/05/2025', status: 'Por Vencer' },
            { id: 'c4', client: 'Patricia Sánchez Vega', policyNumber: 'CH-2025-004612', planType: 'Auto Amplia', vehicle: 'VW Jetta 2024', premium: '$13,500', startDate: '20/01/2025', endDate: '20/01/2026', status: 'Vigente' },
        ],
    },
    {
        id: '2', name: 'HDI Seguros', initials: 'HDI', avatarBg: '#006341', policies: 28, renewalRate: 87,
        premium: 334200, commission: 46788, bonus: 16710,
        clients: [
            { id: 'h1', client: 'Jorge Villanueva Paz', policyNumber: 'HDI-2025-006603', planType: 'Gastos Médicos', vehicle: 'N/A', premium: '$22,750', startDate: '18/01/2025', endDate: '18/01/2026', status: 'Vigente' },
            { id: 'h2', client: 'Ana Martínez Herrera', policyNumber: 'HDI-2025-007412', planType: 'Auto Amplia Plus', vehicle: 'Mazda 3 2023', premium: '$15,800', startDate: '10/03/2025', endDate: '10/03/2026', status: 'Vigente' },
            { id: 'h3', client: 'Fernando López Díaz', policyNumber: 'HDI-2024-005920', planType: 'Auto Base', vehicle: 'Hyundai Accent 2022', premium: '$8,400', startDate: '22/06/2024', endDate: '22/06/2025', status: 'Por Vencer' },
        ],
    },
    {
        id: '3', name: 'Quálitas', initials: 'QU', avatarBg: '#CC0000', policies: 61, renewalRate: 83,
        premium: 548700, commission: 71331, bonus: 27435,
        clients: [
            { id: 'q1', client: 'Roberto Gómez Salinas', policyNumber: 'QUA-2025-002156', planType: 'Auto Base', vehicle: 'Nissan Versa 2022', premium: '$8,900', startDate: '22/06/2025', endDate: '22/06/2026', status: 'Vigente' },
            { id: 'q2', client: 'Sofía Delgado Ríos', policyNumber: 'QUA-2024-008390', planType: 'Auto Amplia', vehicle: 'Toyota Corolla 2023', premium: '$11,100', startDate: '30/04/2024', endDate: '30/04/2025', status: 'Por Vencer' },
            { id: 'q3', client: 'Diego Ramírez Castro', policyNumber: 'QUA-2025-009120', planType: 'Auto Amplia', vehicle: 'VW Jetta 2024', premium: '$12,300', startDate: '05/02/2025', endDate: '05/02/2026', status: 'Vigente' },
            { id: 'q4', client: 'Carmen Flores Ortiz', policyNumber: 'QUA-2025-009245', planType: 'Auto Base', vehicle: 'Chevrolet Aveo 2023', premium: '$6,800', startDate: '12/01/2025', endDate: '12/01/2026', status: 'Vigente' },
            { id: 'q5', client: 'Transportes del Valle SA', policyNumber: 'QUA-2023-005100', planType: 'Flotilla', vehicle: '12 unidades', premium: '$72,000', startDate: '01/08/2023', endDate: '01/08/2024', status: 'Vencida' },
        ],
    },
    {
        id: '4', name: 'Mapfre', initials: 'MA', avatarBg: '#E30613', policies: 19, renewalRate: 78,
        premium: 189400, commission: 22728, bonus: 9470,
        clients: [
            { id: 'm1', client: 'Lucía Reyes Castillo', policyNumber: 'MAP-2025-004871', planType: 'Vida Temporaria', vehicle: 'N/A', premium: '$6,300', startDate: '01/02/2025', endDate: '01/02/2026', status: 'Vigente' },
            { id: 'm2', client: 'Construcciones Vargas e Hijos', policyNumber: 'MAP-2025-001045', planType: 'Responsabilidad Civil', vehicle: 'N/A', premium: '$34,600', startDate: '12/09/2025', endDate: '12/09/2026', status: 'Vigente' },
            { id: 'm3', client: 'Andrés Morales Peña', policyNumber: 'MAP-2024-003780', planType: 'Auto Amplia', vehicle: 'Mazda 3 2022', premium: '$13,200', startDate: '15/06/2024', endDate: '15/06/2025', status: 'Por Vencer' },
        ],
    },
    {
        id: '5', name: 'Zurich', initials: 'ZU', avatarBg: '#003399', policies: 22, renewalRate: 89,
        premium: 276100, commission: 38654, bonus: 13805,
        clients: [
            { id: 'z1', client: 'Elena Torres Guzmán', policyNumber: 'ZUR-2025-001230', planType: 'Auto Amplia Plus', vehicle: 'Toyota Corolla Hybrid 2024', premium: '$16,400', startDate: '08/03/2025', endDate: '08/03/2026', status: 'Vigente' },
            { id: 'z2', client: 'Miguel Ángel Rojas', policyNumber: 'ZUR-2025-001287', planType: 'Auto Base', vehicle: 'Hyundai Accent 2023', premium: '$9,100', startDate: '20/02/2025', endDate: '20/02/2026', status: 'Vigente' },
            { id: 'z3', client: 'Grupo Industrial León SA', policyNumber: 'ZUR-2024-000945', planType: 'Flotilla Plus', vehicle: '5 unidades', premium: '$38,500', startDate: '01/11/2024', endDate: '01/11/2025', status: 'Vigente' },
        ],
    },
    {
        id: '6', name: 'AXA', initials: 'AXA', avatarBg: '#00008F', policies: 45, renewalRate: 92,
        premium: 612300, commission: 97968, bonus: 30615,
        clients: [
            { id: 'a1', client: 'Empresa Logistics SA de CV', policyNumber: 'AXA-2024-003291', planType: 'Flotilla Plus', vehicle: '8 unidades', premium: '$48,000', startDate: '01/01/2024', endDate: '31/12/2024', status: 'Vencida' },
            { id: 'a2', client: 'Transportes Rápidos del Norte', policyNumber: 'AXA-2023-011220', planType: 'Equipo Pesado', vehicle: '15 unidades', premium: '$62,400', startDate: '15/07/2023', endDate: '15/07/2024', status: 'Vencida' },
            { id: 'a3', client: 'Valentina Cruz Ibarra', policyNumber: 'AXA-2025-012450', planType: 'Auto Amplia', vehicle: 'VW Jetta 2024', premium: '$14,200', startDate: '10/01/2025', endDate: '10/01/2026', status: 'Vigente' },
            { id: 'a4', client: 'Ricardo Navarro Solís', policyNumber: 'AXA-2025-012510', planType: 'Auto Amplia Plus', vehicle: 'Mazda 3 Signature 2024', premium: '$18,900', startDate: '25/02/2025', endDate: '25/02/2026', status: 'Vigente' },
            { id: 'a5', client: 'Isabel Domínguez Lara', policyNumber: 'AXA-2025-012580', planType: 'Gastos Médicos', vehicle: 'N/A', premium: '$25,600', startDate: '05/03/2025', endDate: '05/03/2026', status: 'Vigente' },
        ],
    },
]

function StatusBadge({ status }: { status: InsurerClient['status'] }) {
    return (
        <Badge className={cn(
            'font-medium text-xs',
            status === 'Vigente' && 'bg-success hover:bg-success text-white',
            status === 'Por Vencer' && 'bg-warning hover:bg-warning text-white',
            status === 'Vencida' && 'bg-destructive/10 hover:bg-destructive/20 text-destructive border-transparent'
        )} variant={status === 'Vencida' ? 'outline' : 'default'}>
            {status}
        </Badge>
    )
}

export default function InsurersPage() {
    const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null)
    const [search, setSearch] = useState('')

    // Detail view
    if (selectedInsurer) {
        const filtered = search
            ? selectedInsurer.clients.filter(c =>
                c.client.toLowerCase().includes(search.toLowerCase()) ||
                c.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
                c.planType.toLowerCase().includes(search.toLowerCase()) ||
                c.vehicle.toLowerCase().includes(search.toLowerCase())
            )
            : selectedInsurer.clients

        const vigentes = selectedInsurer.clients.filter(c => c.status === 'Vigente').length
        const porVencer = selectedInsurer.clients.filter(c => c.status === 'Por Vencer').length
        const vencidas = selectedInsurer.clients.filter(c => c.status === 'Vencida').length

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Back */}
                <button
                    onClick={() => { setSelectedInsurer(null); setSearch('') }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Aseguradoras
                </button>

                {/* Insurer header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ backgroundColor: selectedInsurer.avatarBg }}
                    >
                        {selectedInsurer.initials}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-primary">{selectedInsurer.name}</h1>
                            <Badge className="bg-success hover:bg-success text-white">Activa</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">Clientes y pólizas asociadas a esta aseguradora</p>
                    </div>
                </div>

                {/* Financial row - Prima / Comisión / Bono */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm border-l-4 border-l-accent">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-accent" />
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prima</p>
                            </div>
                            <p className="text-2xl font-bold text-primary">{formatMXN(selectedInsurer.premium)}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-success">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-4 h-4 text-success" />
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comisión</p>
                            </div>
                            <p className="text-2xl font-bold text-primary">{formatMXN(selectedInsurer.commission)}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-warning">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="w-4 h-4 text-warning" />
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bono</p>
                            </div>
                            <p className="text-2xl font-bold text-primary">{formatMXN(selectedInsurer.bonus)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary stats row */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/5">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-primary">{selectedInsurer.policies}</p>
                                <p className="text-xs text-muted-foreground">Pólizas</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <TrendingUp className="w-4 h-4 text-success" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-primary">{selectedInsurer.renewalRate}%</p>
                                <p className="text-xs text-muted-foreground">Renovación</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Users className="w-4 h-4 text-warning" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-primary">{selectedInsurer.clients.length}</p>
                                <p className="text-xs text-muted-foreground">Clientes</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status summary */}
                <div className="flex gap-3">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-3 py-1">{vigentes} Vigentes</Badge>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1">{porVencer} Por Vencer</Badge>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1">{vencidas} Vencidas</Badge>
                </div>

                {/* Table */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Clientes y Pólizas</CardTitle>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar cliente, póliza, plan..."
                                    className="pl-8 bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>No. Póliza</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Vehículo</TableHead>
                                        <TableHead>Prima</TableHead>
                                        <TableHead>Vigencia</TableHead>
                                        <TableHead>Estatus</TableHead>
                                        <TableHead className="w-[50px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                No se encontraron clientes con ese criterio.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map(c => (
                                            <TableRow key={c.id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-medium">{c.client}</TableCell>
                                                <TableCell className="font-mono text-sm">{c.policyNumber}</TableCell>
                                                <TableCell>{c.planType}</TableCell>
                                                <TableCell className="text-muted-foreground">{c.vehicle}</TableCell>
                                                <TableCell className="font-semibold text-primary">{c.premium}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{c.startDate}</div>
                                                    <div className="text-xs text-muted-foreground">{c.endDate}</div>
                                                </TableCell>
                                                <TableCell><StatusBadge status={c.status} /></TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {filtered.length > 0 && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Mostrando <span className="font-semibold text-foreground">{filtered.length}</span> de <span className="font-semibold text-foreground">{selectedInsurer.clients.length}</span> clientes
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Grid view
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Aseguradoras</h1>
                <p className="text-muted-foreground mt-2">Compañías con las que operamos. Consulta estadísticas y clientes.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {insurers.map((insurer) => (
                    <Card
                        key={insurer.id}
                        className="shadow-sm hover:shadow-md transition-all duration-200 border-b-4 border-b-transparent hover:border-b-accent"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex items-center justify-center w-14 h-14 rounded-lg flex-shrink-0 text-white font-bold text-sm tracking-wide select-none"
                                    style={{ backgroundColor: insurer.avatarBg }}
                                >
                                    {insurer.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base font-semibold text-primary truncate">{insurer.name}</CardTitle>
                                    <div className="mt-1">
                                        <Badge className="bg-success hover:bg-success text-white text-xs font-medium">Activa</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                                    <p className="text-xs text-muted-foreground font-medium">Pólizas activas</p>
                                    <p className="text-xl font-bold text-primary mt-0.5">{insurer.policies}</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                                    <p className="text-xs text-muted-foreground font-medium">Renovación</p>
                                    <p className="text-xl font-bold text-primary mt-0.5">{insurer.renewalRate}%</p>
                                </div>
                            </div>

                            {/* Financials */}
                            <div className="space-y-1.5 border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <DollarSign className="w-3.5 h-3.5 text-accent" />
                                        <span>Prima</span>
                                    </div>
                                    <span className="font-semibold text-primary">{formatMXN(insurer.premium)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Wallet className="w-3.5 h-3.5 text-success" />
                                        <span>Comisión</span>
                                    </div>
                                    <span className="font-semibold text-primary">{formatMXN(insurer.commission)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Gift className="w-3.5 h-3.5 text-warning" />
                                        <span>Bono</span>
                                    </div>
                                    <span className="font-semibold text-primary">{formatMXN(insurer.bonus)}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedInsurer(insurer)}
                            >
                                Ver detalles
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
