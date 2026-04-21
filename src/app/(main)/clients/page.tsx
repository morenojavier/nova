'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Search, Plus, X, CheckCircle2, ArrowLeft,
  CreditCard, Building2, Banknote,
  Calendar, MapPin, Phone, Mail,
  Car, Users,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientType = 'contratante' | 'asegurado'
type PolicyStatus = 'Vigente' | 'Por Vencer' | 'Vencida'
type PaymentMethod = 'Tarjeta' | 'Transferencia' | 'Depósito'

interface Policy {
  policyNumber: string
  insurer: string
  planType: string
  startDate: string
  endDate: string
  premium: string
  status: PolicyStatus
  vehicleId?: string
}

interface InsurerPeriod {
  insurer: string
  fromYear: number
  toYear: number | null
  months: number
  role: 'Contratante' | 'Asegurado'
  vehicleOrPolicy: string
  vehicleId?: string
}

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plates: string
  owned: string
}

interface ContratanteOf {
  name: string
  relationship: string
}

interface ClientHistory {
  insurerTimeline: InsurerPeriod[]
  vehicles: Vehicle[]
  contratanteOf: ContratanteOf[]
}

interface Payment {
  date: string
  policyNumber: string
  insurer: string
  amount: string
  method: PaymentMethod
  description: string
  vehicleId?: string
}

interface Address {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zip: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  types: ClientType[]
  policies: Policy[]
  address?: Address
  curp?: string
  birthDate?: string
  sex?: 'Masculino' | 'Femenino'
  birthState?: string
  history?: ClientHistory
  payments?: Payment[]
}

// ─── Initial Mock Data ───────────────────────────────────────────────────────

const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Alejandro Torres Morales',
    email: 'alejandro.torres@correo.mx',
    phone: '55 1234 5678',
    types: ['contratante', 'asegurado'],
    curp: 'TOMA901215HDFRRLA2',
    birthDate: '15/12/1990',
    sex: 'Masculino',
    birthState: 'Ciudad de México',
    address: {
      street: 'Av. Insurgentes Sur',
      number: '2374',
      neighborhood: 'Florida',
      city: 'Ciudad de México',
      state: 'Ciudad de México',
      zip: '01030',
    },
    policies: [
      { policyNumber: 'POL-001234', insurer: 'GNP Seguros', planType: 'Auto Amplia', startDate: '01/01/2025', endDate: '01/01/2026', premium: '$8,450.00', status: 'Vigente', vehicleId: 'v1' },
      { policyNumber: 'POL-001235', insurer: 'Qualitas', planType: 'Hogar Plus', startDate: '15/03/2025', endDate: '15/03/2026', premium: '$4,200.00', status: 'Vigente' },
    ],
    history: {
      insurerTimeline: [
        { insurer: 'GNP Seguros', fromYear: 2024, toYear: null, months: 12, role: 'Contratante', vehicleOrPolicy: 'Toyota Corolla 2024', vehicleId: 'v1' },
        { insurer: 'Qualitas', fromYear: 2022, toYear: 2024, months: 24, role: 'Contratante', vehicleOrPolicy: 'Honda CR-V 2022', vehicleId: 'v2' },
        { insurer: 'GNP Seguros', fromYear: 2019, toYear: 2022, months: 36, role: 'Contratante', vehicleOrPolicy: 'Honda Civic 2018', vehicleId: 'v3' },
      ],
      vehicles: [
        { id: 'v1', brand: 'Toyota', model: 'Corolla', year: 2024, plates: 'JHK-23-74', owned: '2024 – actual' },
        { id: 'v2', brand: 'Honda', model: 'CR-V', year: 2022, plates: 'TGR-18-02', owned: '2022 – 2024' },
        { id: 'v3', brand: 'Honda', model: 'Civic', year: 2018, plates: 'GFP-90-11', owned: '2018 – 2022' },
      ],
      contratanteOf: [
        { name: 'Laura Torres Morales', relationship: 'Hija' },
      ],
    },
    payments: [
      { date: '10/01/2020', policyNumber: 'GNP-2019-003412', insurer: 'GNP Seguros', amount: '$7,200.00', method: 'Tarjeta', description: 'Pago inicial', vehicleId: 'v3' },
      { date: '12/01/2021', policyNumber: 'GNP-2019-003412', insurer: 'GNP Seguros', amount: '$7,600.00', method: 'Transferencia', description: 'Renovación anual', vehicleId: 'v3' },
      { date: '11/01/2022', policyNumber: 'GNP-2019-003412', insurer: 'GNP Seguros', amount: '$7,950.00', method: 'Tarjeta', description: 'Renovación anual', vehicleId: 'v3' },
      { date: '05/03/2022', policyNumber: 'QUA-2022-009811', insurer: 'Qualitas', amount: '$9,100.00', method: 'Depósito', description: 'Pago inicial', vehicleId: 'v2' },
      { date: '07/03/2023', policyNumber: 'QUA-2022-009811', insurer: 'Qualitas', amount: '$9,500.00', method: 'Tarjeta', description: 'Renovación anual', vehicleId: 'v2' },
      { date: '10/03/2024', policyNumber: 'QUA-2022-009811', insurer: 'Qualitas', amount: '$9,800.00', method: 'Transferencia', description: 'Renovación anual', vehicleId: 'v2' },
      { date: '01/01/2025', policyNumber: 'POL-001234', insurer: 'GNP Seguros', amount: '$8,450.00', method: 'Tarjeta', description: 'Pago inicial – Toyota Corolla 2024', vehicleId: 'v1' },
    ],
  },
  {
    id: '2',
    name: 'María Fernández Jiménez',
    email: 'mariaf@empresa.com.mx',
    phone: '55 9876 5432',
    types: ['asegurado'],
    curp: 'FEJM850320MDFNRRA8',
    birthDate: '20/03/1985',
    sex: 'Femenino',
    birthState: 'Jalisco',
    address: {
      street: 'Calle Tamarindos',
      number: '45',
      neighborhood: 'Bosques de las Lomas',
      city: 'Guadalajara',
      state: 'Jalisco',
      zip: '44650',
    },
    policies: [
      { policyNumber: 'POL-002100', insurer: 'AXA México', planType: 'Gastos Médicos Mayores', startDate: '10/06/2024', endDate: '10/06/2025', premium: '$12,300.00', status: 'Por Vencer' },
    ],
    history: {
      insurerTimeline: [
        { insurer: 'AXA México', fromYear: 2024, toYear: null, months: 12, role: 'Asegurado', vehicleOrPolicy: 'Gastos Médicos Mayores' },
        { insurer: 'MetLife', fromYear: 2021, toYear: 2024, months: 36, role: 'Asegurado', vehicleOrPolicy: 'Vida Protección' },
      ],
      vehicles: [],
      contratanteOf: [],
    },
    payments: [
      { date: '10/06/2021', policyNumber: 'ML-2021-004512', insurer: 'MetLife', amount: '$10,500.00', method: 'Transferencia', description: 'Pago inicial' },
      { date: '10/06/2022', policyNumber: 'ML-2021-004512', insurer: 'MetLife', amount: '$10,900.00', method: 'Transferencia', description: 'Renovación anual' },
      { date: '10/06/2023', policyNumber: 'ML-2021-004512', insurer: 'MetLife', amount: '$11,400.00', method: 'Transferencia', description: 'Renovación anual' },
      { date: '10/06/2024', policyNumber: 'POL-002100', insurer: 'AXA México', amount: '$12,300.00', method: 'Tarjeta', description: 'Pago inicial' },
    ],
  },
  {
    id: '3',
    name: 'Carlos Ramírez Gutiérrez',
    email: 'carlos.r@correo.mx',
    phone: '55 2468 1357',
    types: ['contratante'],
    curp: 'RAGC780510HDFMTRRA5',
    birthDate: '10/05/1978',
    sex: 'Masculino',
    birthState: 'Nuevo León',
    address: {
      street: 'Blvd. Manuel Ávila Camacho',
      number: '1801',
      neighborhood: 'Lomas de Sotelo',
      city: 'Monterrey',
      state: 'Nuevo León',
      zip: '64700',
    },
    policies: [
      { policyNumber: 'POL-003450', insurer: 'Metlife', planType: 'Vida Protección', startDate: '01/03/2024', endDate: '01/03/2025', premium: '$6,800.00', status: 'Vencida' },
      { policyNumber: 'POL-003451', insurer: 'GNP Seguros', planType: 'Auto Limitada', startDate: '20/11/2024', endDate: '20/11/2025', premium: '$5,100.00', status: 'Vigente', vehicleId: 'v1' },
    ],
    history: {
      insurerTimeline: [
        { insurer: 'GNP Seguros', fromYear: 2024, toYear: null, months: 12, role: 'Contratante', vehicleOrPolicy: 'Nissan Sentra 2023', vehicleId: 'v1' },
        { insurer: 'Qualitas', fromYear: 2021, toYear: 2024, months: 36, role: 'Contratante', vehicleOrPolicy: 'Nissan Versa 2020', vehicleId: 'v2' },
      ],
      vehicles: [
        { id: 'v1', brand: 'Nissan', model: 'Sentra', year: 2023, plates: 'PKL-07-19', owned: '2024 – actual' },
        { id: 'v2', brand: 'Nissan', model: 'Versa', year: 2020, plates: 'ABR-44-82', owned: '2021 – 2024' },
      ],
      contratanteOf: [],
    },
    payments: [
      { date: '20/11/2021', policyNumber: 'QUA-2021-007812', insurer: 'Qualitas', amount: '$6,200.00', method: 'Depósito', description: 'Pago inicial', vehicleId: 'v2' },
      { date: '20/11/2022', policyNumber: 'QUA-2021-007812', insurer: 'Qualitas', amount: '$6,500.00', method: 'Depósito', description: 'Renovación anual', vehicleId: 'v2' },
      { date: '20/11/2023', policyNumber: 'QUA-2021-007812', insurer: 'Qualitas', amount: '$6,800.00', method: 'Tarjeta', description: 'Renovación anual', vehicleId: 'v2' },
      { date: '20/11/2024', policyNumber: 'POL-003451', insurer: 'GNP Seguros', amount: '$5,100.00', method: 'Tarjeta', description: 'Pago inicial', vehicleId: 'v1' },
    ],
  },
  {
    id: '4',
    name: 'Sofía López Hernández',
    email: 'sofia.lopez@hotmail.com',
    phone: '55 3692 5814',
    types: ['asegurado'],
    policies: [
      { policyNumber: 'POL-004780', insurer: 'Sura', planType: 'Auto Amplia Plus', startDate: '05/09/2024', endDate: '05/09/2025', premium: '$9,750.00', status: 'Por Vencer' },
    ],
  },
  {
    id: '5',
    name: 'Roberto Sánchez Vega',
    email: 'roberto.sv@gmail.com',
    phone: '55 1592 6483',
    types: ['contratante', 'asegurado'],
    curp: 'SAVR750925HDFNCBRA7',
    birthDate: '25/09/1975',
    sex: 'Masculino',
    birthState: 'Estado de México',
    address: {
      street: 'Av. Ejército Nacional',
      number: '843',
      neighborhood: 'Granada',
      city: 'Ciudad de México',
      state: 'Ciudad de México',
      zip: '11520',
    },
    policies: [
      { policyNumber: 'POL-005012', insurer: 'HDI Seguros', planType: 'Flotilla Comercial', startDate: '01/01/2025', endDate: '01/01/2026', premium: '$32,000.00', status: 'Vigente', vehicleId: 'v1' },
      { policyNumber: 'POL-005013', insurer: 'HDI Seguros', planType: 'Responsabilidad Civil', startDate: '01/01/2025', endDate: '01/01/2026', premium: '$7,500.00', status: 'Vigente', vehicleId: 'v1' },
      { policyNumber: 'POL-005014', insurer: 'Qualitas', planType: 'Equipo Pesado', startDate: '15/02/2024', endDate: '15/02/2025', premium: '$18,200.00', status: 'Vencida', vehicleId: 'v2' },
    ],
    history: {
      insurerTimeline: [
        { insurer: 'HDI Seguros', fromYear: 2025, toYear: null, months: 6, role: 'Contratante', vehicleOrPolicy: 'Flotilla Comercial – 8 unidades', vehicleId: 'v1' },
        { insurer: 'Qualitas', fromYear: 2023, toYear: 2025, months: 24, role: 'Contratante', vehicleOrPolicy: 'Equipo Pesado – 3 camiones', vehicleId: 'v2' },
        { insurer: 'HDI Seguros', fromYear: 2020, toYear: 2023, months: 36, role: 'Contratante', vehicleOrPolicy: 'Flotilla Comercial – 5 unidades', vehicleId: 'v3' },
      ],
      vehicles: [
        { id: 'v1', brand: 'Mercedes-Benz', model: 'Sprinter', year: 2023, plates: 'ZRT-90-44', owned: '2023 – actual' },
        { id: 'v2', brand: 'Ford', model: 'Transit', year: 2020, plates: 'MKP-66-31', owned: '2020 – 2023' },
        { id: 'v3', brand: 'Chevrolet', model: 'Express', year: 2018, plates: 'NLA-12-07', owned: '2018 – 2022' },
      ],
      contratanteOf: [
        { name: 'Valeria Sánchez Torres', relationship: 'Hija' },
      ],
    },
    payments: [
      { date: '15/02/2020', policyNumber: 'HDI-2020-001345', insurer: 'HDI Seguros', amount: '$24,000.00', method: 'Transferencia', description: 'Pago inicial flotilla', vehicleId: 'v3' },
      { date: '15/02/2021', policyNumber: 'HDI-2020-001345', insurer: 'HDI Seguros', amount: '$25,200.00', method: 'Transferencia', description: 'Renovación anual', vehicleId: 'v3' },
      { date: '15/02/2022', policyNumber: 'HDI-2020-001345', insurer: 'HDI Seguros', amount: '$26,500.00', method: 'Transferencia', description: 'Renovación anual', vehicleId: 'v3' },
      { date: '15/02/2023', policyNumber: 'QUA-2023-005100', insurer: 'Qualitas', amount: '$18,200.00', method: 'Depósito', description: 'Pago inicial – Equipo Pesado', vehicleId: 'v2' },
      { date: '15/02/2024', policyNumber: 'QUA-2023-005100', insurer: 'Qualitas', amount: '$18,200.00', method: 'Depósito', description: 'Renovación anual', vehicleId: 'v2' },
      { date: '01/01/2025', policyNumber: 'POL-005012', insurer: 'HDI Seguros', amount: '$32,000.00', method: 'Transferencia', description: 'Pago inicial flotilla comercial', vehicleId: 'v1' },
      { date: '01/01/2025', policyNumber: 'POL-005013', insurer: 'HDI Seguros', amount: '$7,500.00', method: 'Transferencia', description: 'Pago inicial – Responsabilidad Civil', vehicleId: 'v1' },
    ],
  },
  {
    id: '6',
    name: 'Laura Mendoza Castro',
    email: 'lauramendoza@empresa.mx',
    phone: '55 7531 9514',
    types: ['contratante', 'asegurado'],
    policies: [
      { policyNumber: 'POL-006300', insurer: 'Allianz', planType: 'Gastos Médicos Mayores', startDate: '01/04/2025', endDate: '01/04/2026', premium: '$15,600.00', status: 'Vigente' },
    ],
  },
  {
    id: '7',
    name: 'Diego Martínez Flores',
    email: 'diegomf@negocios.com',
    phone: '55 4815 2637',
    types: ['contratante'],
    policies: [
      { policyNumber: 'POL-007890', insurer: 'Banorte Seguros', planType: 'Hogar Base', startDate: '10/10/2024', endDate: '10/10/2025', premium: '$3,400.00', status: 'Por Vencer' },
      { policyNumber: 'POL-007891', insurer: 'GNP Seguros', planType: 'Auto Amplia', startDate: '10/10/2024', endDate: '10/10/2025', premium: '$7,900.00', status: 'Por Vencer' },
    ],
  },
  {
    id: '8',
    name: 'Valeria Ríos Domínguez',
    email: 'valeria.rios@correo.mx',
    phone: '55 9630 1472',
    types: ['asegurado'],
    policies: [
      { policyNumber: 'POL-008540', insurer: 'AXA México', planType: 'Vida Temporal', startDate: '01/07/2024', endDate: '01/07/2025', premium: '$5,250.00', status: 'Vencida' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CLIENT_TYPE_STYLES: Record<ClientType, string> = {
  contratante: 'bg-primary text-white hover:bg-primary/90',
  asegurado: 'bg-accent text-white hover:bg-accent/90',
}

const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  contratante: 'Contratante',
  asegurado: 'Asegurado',
}

const POLICY_STATUS_STYLES: Record<PolicyStatus, string> = {
  Vigente: 'bg-success/10 text-success border-transparent hover:bg-success/20',
  'Por Vencer': 'bg-warning/10 text-warning border-transparent hover:bg-warning/20',
  Vencida: 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20',
}

const PAYMENT_METHOD_STYLES: Record<PaymentMethod, { style: string; Icon: React.ElementType }> = {
  Tarjeta: { style: 'bg-blue-50 text-blue-700 border-blue-200', Icon: CreditCard },
  Transferencia: { style: 'bg-green-50 text-green-700 border-green-200', Icon: Building2 },
  Depósito: { style: 'bg-orange-50 text-orange-700 border-orange-200', Icon: Banknote },
}

const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas',
]

function getHistorySummary(client: Client): string {
  const timeline = client.history?.insurerTimeline ?? []
  if (timeline.length === 0) return 'Sin historial'
  const insurers = new Set(timeline.map(t => t.insurer)).size
  const years = timeline.reduce((acc, t) => acc + Math.round(t.months / 12), 0)
  return `${insurers} aseguradoras, ${years} años`
}

/** Parse a date string "DD/MM/YYYY" into a comparable number (YYYYMMDD). */
function parseDateValue(dateStr: string): number {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return 0
  return parseInt(parts[2]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[0])
}

/** Derive client status on the fly: Activo if any policy is Vigente, else Inactivo. */
function getClientStatus(client: Client): 'Activo' | 'Inactivo' {
  return client.policies.some(p => p.status === 'Vigente') ? 'Activo' : 'Inactivo'
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({
  vehicle,
  timeline,
  vehiclePayments,
  vehiclePolicies,
}: {
  vehicle: Vehicle
  timeline: InsurerPeriod[]
  vehiclePayments: Payment[]
  vehiclePolicies: Policy[]
}) {
  // Most recent payment for this vehicle (sorted by date desc)
  const sortedPayments = [...vehiclePayments].sort(
    (a, b) => parseDateValue(b.date) - parseDateValue(a.date)
  )
  const lastPayment = sortedPayments[0] ?? null

  const canRenewWithCard = lastPayment?.method === 'Tarjeta'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-slate-50/60">
        <div className="flex items-start justify-between gap-4">
          {/* Vehicle info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0 mt-0.5">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base text-primary leading-tight">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Placas: <span className="font-mono font-semibold text-foreground">{vehicle.plates}</span>
                <span className="mx-2 text-border">·</span>
                {vehicle.owned}
              </p>
            </div>
          </div>

          {/* Renovar button */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {canRenewWithCard ? (
              <>
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
                  <CreditCard className="h-3.5 w-3.5" />
                  Renovar con tarjeta
                </Button>
                <p className="text-xs text-muted-foreground">Última forma de pago: Tarjeta</p>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Agregar método de pago
                </Button>
                <p className="text-xs text-muted-foreground">
                  {lastPayment
                    ? `No se puede renovar automáticamente. Última forma de pago: ${lastPayment.method}`
                    : 'Sin registro de pago'}
                </p>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Insurer timeline for this vehicle */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Historial de aseguradoras
          </p>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground py-3 text-center">Sin historial con este vehículo</p>
          ) : (
            <ol className="relative border-l border-border ml-4 space-y-4">
              {timeline.map((period, i) => (
                <li key={i} className="pl-6">
                  <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{period.insurer}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{period.vehicleOrPolicy}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 sm:mt-0 shrink-0">
                      <Badge variant="outline" className={cn('text-xs', period.role === 'Contratante' ? CLIENT_TYPE_STYLES.contratante : CLIENT_TYPE_STYLES.asegurado)}>
                        {period.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {period.fromYear} – {period.toYear === null ? 'actual' : period.toYear}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{period.months} meses</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Pagos subsection */}
        {sortedPayments.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Pagos
            </p>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs pl-4">Fecha</TableHead>
                    <TableHead className="text-xs">Póliza</TableHead>
                    <TableHead className="text-xs">Aseguradora</TableHead>
                    <TableHead className="text-xs">Monto</TableHead>
                    <TableHead className="text-xs">Método</TableHead>
                    <TableHead className="text-xs">Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((p, i) => {
                    const { style, Icon } = PAYMENT_METHOD_STYLES[p.method]
                    return (
                      <TableRow key={i} className="hover:bg-slate-50/50">
                        <TableCell className="text-xs pl-4 font-medium tabular-nums">{p.date}</TableCell>
                        <TableCell className="text-xs font-mono">{p.policyNumber}</TableCell>
                        <TableCell className="text-xs">{p.insurer}</TableCell>
                        <TableCell className="text-xs font-semibold">{p.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs gap-1', style)}>
                            <Icon className="h-3 w-3" />
                            {p.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.description}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pólizas subsection */}
        {vehiclePolicies.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Pólizas
            </p>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs pl-4">No. Póliza</TableHead>
                    <TableHead className="text-xs">Aseguradora</TableHead>
                    <TableHead className="text-xs">Plan</TableHead>
                    <TableHead className="text-xs">Vigencia</TableHead>
                    <TableHead className="text-xs">Prima</TableHead>
                    <TableHead className="text-xs">Estatus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiclePolicies.map((policy) => (
                    <TableRow key={policy.policyNumber} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs font-mono font-medium pl-4">{policy.policyNumber}</TableCell>
                      <TableCell className="text-xs">{policy.insurer}</TableCell>
                      <TableCell className="text-xs">{policy.planType}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{policy.startDate} – {policy.endDate}</TableCell>
                      <TableCell className="text-xs font-medium">{policy.premium}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs', POLICY_STATUS_STYLES[policy.status])}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Detail View ─────────────────────────────────────────────────────────────

function ClientDetailView({ client, onBack }: { client: Client; onBack: () => void }) {
  const vehicles = client.history?.vehicles ?? []
  const contratanteOf = client.history?.contratanteOf ?? []
  const allTimeline = [...(client.history?.insurerTimeline ?? [])].sort((a, b) => b.fromYear - a.fromYear)
  const allPayments = client.payments ?? []

  // Payments without vehicleId (generic)
  const otherPayments = [...allPayments]
    .filter(p => !p.vehicleId)
    .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date))

  // Policies without vehicleId
  const otherPolicies = client.policies.filter(p => !p.vehicleId)

  // Non-vehicle timeline entries (no vehicleId, e.g. health/life insurance)
  const nonVehicleTimeline = allTimeline.filter(t => !t.vehicleId)

  function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value?: string }) {
    if (!value) return null
    return (
      <div className="flex items-start gap-2 py-2 border-b border-border/50 last:border-0">
        {icon && <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
          <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
        </div>
      </div>
    )
  }

  const formattedAddress = client.address
    ? `${client.address.street} ${client.address.number}, ${client.address.neighborhood}, ${client.address.city}, ${client.address.state} CP ${client.address.zip}`
    : undefined

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 shrink-0">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-primary truncate">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {client.types.map(t => (
              <Badge key={t} className={cn('text-xs font-medium', CLIENT_TYPE_STYLES[t])}>
                {CLIENT_TYPE_LABELS[t]}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground">{client.policies.length} póliza{client.policies.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Section 1 — Datos del cliente */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Datos del cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Correo electrónico" value={client.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={client.phone} />
            <InfoRow label="CURP" value={client.curp} />
            <InfoRow label="Sexo" value={client.sex} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fecha de nacimiento" value={client.birthDate} />
            <InfoRow label="Estado de nacimiento" value={client.birthState} />
            <div className="sm:col-span-2">
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Domicilio" value={formattedAddress} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Vehículos y su histórico */}
      {vehicles.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-primary">Vehículos y su histórico</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Historial de aseguradoras, pagos y pólizas agrupados por vehículo.
            </p>
          </div>

          {vehicles.map((vehicle) => {
            const vehicleTimeline = allTimeline.filter(t => t.vehicleId === vehicle.id)
            const vehiclePayments = allPayments.filter(p => p.vehicleId === vehicle.id)
            const vehiclePolicies = client.policies.filter(p => p.vehicleId === vehicle.id)

            return (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                timeline={vehicleTimeline}
                vehiclePayments={vehiclePayments}
                vehiclePolicies={vehiclePolicies}
              />
            )
          })}
        </div>
      )}

      {/* Non-vehicle insurer timeline (health, life, etc.) */}
      {nonVehicleTimeline.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Historial de aseguradoras (otros)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border ml-4 space-y-5">
              {nonVehicleTimeline.map((period, i) => (
                <li key={i} className="pl-6">
                  <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{period.insurer}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{period.vehicleOrPolicy}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 sm:mt-0 shrink-0">
                      <Badge variant="outline" className={cn('text-xs', period.role === 'Contratante' ? CLIENT_TYPE_STYLES.contratante : CLIENT_TYPE_STYLES.asegurado)}>
                        {period.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {period.fromYear} – {period.toYear === null ? 'actual' : period.toYear}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{period.months} meses</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Contratante de */}
      {contratanteOf.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Contratante de</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contratanteOf.map((person, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border bg-slate-50/60 p-3">
                  <div className="rounded-lg bg-accent/10 p-2 shrink-0">
                    <Users className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.relationship}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other policies (no vehicleId) */}
      {otherPolicies.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Pólizas sin vehículo asociado</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-b-md border-t overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs pl-4">No. Póliza</TableHead>
                    <TableHead className="text-xs">Aseguradora</TableHead>
                    <TableHead className="text-xs">Plan</TableHead>
                    <TableHead className="text-xs">Vigencia</TableHead>
                    <TableHead className="text-xs">Prima</TableHead>
                    <TableHead className="text-xs">Estatus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherPolicies.map((policy) => (
                    <TableRow key={policy.policyNumber} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs font-mono font-medium pl-4">{policy.policyNumber}</TableCell>
                      <TableCell className="text-xs">{policy.insurer}</TableCell>
                      <TableCell className="text-xs">{policy.planType}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{policy.startDate} – {policy.endDate}</TableCell>
                      <TableCell className="text-xs font-medium">{policy.premium}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs', POLICY_STATUS_STYLES[policy.status])}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Otros pagos (no vehicleId) */}
      {otherPayments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Otros pagos</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Pagos no asociados a un vehículo específico.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-b-md border-t overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs pl-4">Fecha</TableHead>
                    <TableHead className="text-xs">Póliza</TableHead>
                    <TableHead className="text-xs">Aseguradora</TableHead>
                    <TableHead className="text-xs">Monto</TableHead>
                    <TableHead className="text-xs">Método</TableHead>
                    <TableHead className="text-xs">Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherPayments.map((p, i) => {
                    const { style, Icon } = PAYMENT_METHOD_STYLES[p.method]
                    return (
                      <TableRow key={i} className="hover:bg-slate-50/50">
                        <TableCell className="text-xs pl-4 font-medium tabular-nums">{p.date}</TableCell>
                        <TableCell className="text-xs font-mono">{p.policyNumber}</TableCell>
                        <TableCell className="text-xs">{p.insurer}</TableCell>
                        <TableCell className="text-xs font-semibold">{p.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs gap-1', style)}>
                            <Icon className="h-3 w-3" />
                            {p.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.description}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback: clients with no vehicles and no history at all — show all policies */}
      {vehicles.length === 0 && nonVehicleTimeline.length === 0 && client.policies.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Pólizas activas e históricas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-b-md border-t overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs pl-4">No. Póliza</TableHead>
                    <TableHead className="text-xs">Aseguradora</TableHead>
                    <TableHead className="text-xs">Plan</TableHead>
                    <TableHead className="text-xs">Vigencia</TableHead>
                    <TableHead className="text-xs">Prima</TableHead>
                    <TableHead className="text-xs">Estatus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.policies.map((policy) => (
                    <TableRow key={policy.policyNumber} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs font-mono font-medium pl-4">{policy.policyNumber}</TableCell>
                      <TableCell className="text-xs">{policy.insurer}</TableCell>
                      <TableCell className="text-xs">{policy.planType}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{policy.startDate} – {policy.endDate}</TableCell>
                      <TableCell className="text-xs font-medium">{policy.premium}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs', POLICY_STATUS_STYLES[policy.status])}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── New Client Modal ────────────────────────────────────────────────────────

function NewClientModal({
  onClose,
  onSave,
  existingNames,
}: {
  onClose: () => void
  onSave: (client: Client) => void
  existingNames: string[]
}) {
  const [form, setForm] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    curp: '',
    email: '',
    phone: '',
    sex: '' as '' | 'Masculino' | 'Femenino',
    birthDate: '',
    birthState: '',
    types: ['contratante'] as ClientType[],
    street: '',
    number: '',
    neighborhood: '',
    zip: '',
    city: '',
    addressState: '',
  })
  const [duplicateWarning, setDuplicateWarning] = useState(false)

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (field === 'firstName' || field === 'paternalLastName' || field === 'maternalLastName') {
      const full = `${next.firstName} ${next.paternalLastName} ${next.maternalLastName}`.trim().toLowerCase()
      setDuplicateWarning(existingNames.some(n => n.toLowerCase() === full))
    }
  }

  const fullName = `${form.firstName} ${form.paternalLastName} ${form.maternalLastName}`.trim()

  const isValid =
    form.firstName.trim().length >= 2 &&
    form.paternalLastName.trim().length >= 2 &&
    form.email.includes('@') &&
    form.phone.replace(/\D/g, '').length >= 10 &&
    form.sex !== '' &&
    form.birthDate !== '' &&
    form.types.length >= 1 &&
    !duplicateWarning

  function handleSave() {
    const hasAddress = form.street || form.number || form.city || form.addressState
    onSave({
      id: String(Date.now()),
      name: fullName,
      email: form.email,
      phone: form.phone,
      types: form.types,
      curp: form.curp || undefined,
      birthDate: form.birthDate || undefined,
      sex: form.sex || undefined,
      birthState: form.birthState || undefined,
      address: hasAddress
        ? {
            street: form.street,
            number: form.number,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.addressState,
            zip: form.zip,
          }
        : undefined,
      policies: [],
      history: { insurerTimeline: [], vehicles: [], contratanteOf: [] },
      payments: [],
    })
  }

  const selectClass =
    'flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Nuevo Cliente</h2>
            <p className="text-white/70 text-sm">Completa los datos para registrar al cliente</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Tipo de cliente — multi-select toggles */}
          <div className="space-y-2">
            <Label>Tipo de cliente <span className="text-muted-foreground font-normal">(selecciona uno o ambos)</span></Label>
            <div className="flex gap-2">
              {(['contratante', 'asegurado'] as ClientType[]).map(t => {
                const selected = form.types.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? form.types.filter(x => x !== t)
                        : [...form.types, t]
                      setForm(prev => ({ ...prev, types: next }))
                    }}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                      selected
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {CLIENT_TYPE_LABELS[t]}
                  </button>
                )
              })}
            </div>
            {form.types.length === 0 && (
              <p className="text-xs text-destructive">Selecciona al menos un tipo.</p>
            )}
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nombre(s)</Label>
              <Input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Nombre" className="h-10" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apellido paterno</Label>
              <Input value={form.paternalLastName} onChange={(e) => update('paternalLastName', e.target.value)} placeholder="Paterno" className="h-10" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apellido materno</Label>
              <Input value={form.maternalLastName} onChange={(e) => update('maternalLastName', e.target.value)} placeholder="Materno" className="h-10" />
            </div>
          </div>

          {/* Duplicate warning */}
          {duplicateWarning && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning font-medium">
              Ya existe un cliente con el nombre &quot;{fullName}&quot;. Verifica que no sea duplicado.
            </div>
          )}

          {/* CURP */}
          <div className="space-y-1">
            <Label className="text-xs">CURP</Label>
            <Input
              value={form.curp}
              onChange={(e) => update('curp', e.target.value.toUpperCase().slice(0, 18))}
              placeholder="18 caracteres"
              className="h-10 font-mono uppercase tracking-widest"
              maxLength={18}
            />
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label className="text-xs">Sexo</Label>
            <div className="flex gap-3">
              {(['Masculino', 'Femenino'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => update('sex', opt)}
                  className={cn(
                    'flex-1 py-2 rounded-xl border text-sm font-semibold transition-all',
                    form.sex === opt
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Birth date + state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Fecha de nacimiento</Label>
              <Input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Estado de nacimiento</Label>
              <select value={form.birthState} onChange={(e) => update('birthState', e.target.value)} className={selectClass}>
                <option value="">Selecciona</option>
                {mexicanStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Correo electrónico</Label>
              <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="correo@ejemplo.com" className="h-10" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Celular</Label>
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="10 dígitos"
                className="h-10"
              />
            </div>
          </div>

          {/* Address section */}
          <div className="pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Domicilio (opcional)</p>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Calle</Label>
                  <Input value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="Nombre de la calle" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Número ext.</Label>
                  <Input value={form.number} onChange={(e) => update('number', e.target.value)} placeholder="Ej: 45" className="h-10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Colonia</Label>
                  <Input value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} placeholder="Colonia" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Código postal</Label>
                  <Input
                    value={form.zip}
                    onChange={(e) => update('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="5 dígitos"
                    className="h-10"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Ciudad</Label>
                  <Input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Ciudad" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Estado</Label>
                  <select value={form.addressState} onChange={(e) => update('addressState', e.target.value)} className={selectClass}>
                    <option value="">Selecciona</option>
                    {mexicanStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3 justify-end bg-slate-50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Guardar Cliente
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showNewClient, setShowNewClient] = useState(false)

  const filtered = clients.filter((client) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    return (
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.includes(term)
    )
  })

  function handleAddClient(client: Client) {
    setClients(prev => [client, ...prev])
    setShowNewClient(false)
  }

  // Detail view
  if (selectedClient) {
    return (
      <ClientDetailView
        client={selectedClient}
        onBack={() => setSelectedClient(null)}
      />
    )
  }

  // List view
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu cartera de clientes y consulta el detalle de sus pólizas.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto"
          onClick={() => setShowNewClient(true)}
        >
          <Plus className="h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Directorio</CardTitle>
              <span className="text-sm text-muted-foreground font-normal">
                {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, correo o teléfono..."
                className="pl-8 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-b-md border-t overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-4">Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Pólizas</TableHead>
                  <TableHead>Historial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No se encontraron clientes con ese criterio de búsqueda.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((client) => {
                  const status = getClientStatus(client)
                  return (
                  <TableRow
                    key={client.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell className="pl-4 font-medium text-primary">{client.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="text-sm">{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {client.types.map(t => (
                          <Badge key={t} className={cn('text-[10px] px-1.5 py-0 font-medium w-fit', CLIENT_TYPE_STYLES[t])}>
                            {CLIENT_TYPE_LABELS[t]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        'text-xs font-medium border-transparent',
                        status === 'Activo'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      )}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold w-7 h-7">
                        {client.policies.length}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-xs',
                        client.history?.insurerTimeline.length
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      )}>
                        {getHistorySummary(client)}
                      </span>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Client Modal */}
      {showNewClient && (
        <NewClientModal
          onClose={() => setShowNewClient(false)}
          onSave={handleAddClient}
          existingNames={clients.map(c => c.name)}
        />
      )}
    </div>
  )
}
