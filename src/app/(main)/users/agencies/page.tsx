'use client'

import { useState, useMemo, Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Search, Plus, MoreHorizontal, Building2, Users as UsersIcon, Wrench, X, UserCheck, ChevronDown, Percent } from 'lucide-react'
import { INITIAL_USERS, ROLE_LABELS, ROLE_BADGE_STYLES, MOCK_GROUPS, type PlatformUser } from '@/features/users/data/users'

// ─── Types ────────────────────────────────────────────────────────────────────

type AgencyStatus = 'Activa' | 'Inactiva'

interface AgencyCommissions {
  comision: number
  bonoInicial: number
  bonoSiniestral: number
  bonoRenovacion: number
  bonoCartera: number
  bonoIntegral: number
  udi: number
  intervita: number
  nova: number
}

interface Agency {
  id: string
  name: string
  group: string
  armadora: string
  location: string
  state: string
  manager: string
  sellers: number
  policies: number
  status: AgencyStatus
  createdAt: string
  commissions?: AgencyCommissions
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVAILABLE_ARMADORAS = [
  'Toyota', 'Honda', 'Nissan', 'Volkswagen', 'Mazda',
  'Hyundai', 'Chevrolet', 'Ford', 'Kia',
]

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'CDMX', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas',
]

const DEFAULT_COMMISSIONS: AgencyCommissions = {
  comision: 14,
  bonoInicial: 2,
  bonoSiniestral: 1.5,
  bonoRenovacion: 3,
  bonoCartera: 1,
  bonoIntegral: 2.5,
  udi: 1.2,
  intervita: 2.8,
  nova: 1.4,
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const INITIAL_AGENCIES: Agency[] = [
  { id: '1', name: 'Toyota Monterrey', group: 'Grupo Automotriz del Norte', armadora: 'Toyota', location: 'San Nicolás', state: 'Nuevo León', manager: 'Arturo Benítez Valencia', sellers: 12, policies: 148, status: 'Activa', createdAt: '15/03/2022', commissions: { comision: 14, bonoInicial: 2, bonoSiniestral: 1.5, bonoRenovacion: 3, bonoCartera: 1, bonoIntegral: 2.5, udi: 1.2, intervita: 2.8, nova: 1.4 } },
  { id: '2', name: 'Honda San Pedro', group: 'Grupo Automotriz del Norte', armadora: 'Honda', location: 'San Pedro Garza García', state: 'Nuevo León', manager: 'Ricardo Peña Saucedo', sellers: 8, policies: 94, status: 'Activa', createdAt: '20/06/2022', commissions: { comision: 13, bonoInicial: 1.8, bonoSiniestral: 1.2, bonoRenovacion: 2.5, bonoCartera: 0.9, bonoIntegral: 2.2, udi: 1.0, intervita: 3.2, nova: 1.6 } },
  { id: '3', name: 'Nissan Apodaca', group: 'Grupo Automotriz del Norte', armadora: 'Nissan', location: 'Apodaca', state: 'Nuevo León', manager: 'Viviana Castillo Ramos', sellers: 10, policies: 112, status: 'Activa', createdAt: '02/02/2023', commissions: { comision: 15, bonoInicial: 2.2, bonoSiniestral: 1.8, bonoRenovacion: 2.8, bonoCartera: 1.1, bonoIntegral: 2.8, udi: 1.4, intervita: 2.5, nova: 1.2 } },
  { id: '4', name: 'VW Cumbres', group: 'Grupo Automotriz del Norte', armadora: 'Volkswagen', location: 'Cumbres', state: 'Nuevo León', manager: 'Manuel Ortega Reyes', sellers: 7, policies: 78, status: 'Activa', createdAt: '11/08/2023', commissions: { comision: 12, bonoInicial: 1.5, bonoSiniestral: 1.0, bonoRenovacion: 2.2, bonoCartera: 0.8, bonoIntegral: 2.0, udi: 0.9, intervita: 3.5, nova: 1.8 } },
  { id: '5', name: 'Mazda Polanco', group: 'Grupo Premium Motors', armadora: 'Mazda', location: 'Polanco', state: 'CDMX', manager: 'Isabela Cruz Alarcón', sellers: 9, policies: 102, status: 'Activa', createdAt: '08/07/2023', commissions: { comision: 16, bonoInicial: 2.5, bonoSiniestral: 2.0, bonoRenovacion: 3.0, bonoCartera: 1.2, bonoIntegral: 3.0, udi: 1.5, intervita: 2.0, nova: 1.0 } },
  { id: '6', name: 'Toyota Santa Fe', group: 'Grupo Premium Motors', armadora: 'Toyota', location: 'Santa Fe', state: 'CDMX', manager: 'Carolina Jurado Pineda', sellers: 14, policies: 186, status: 'Activa', createdAt: '20/09/2023', commissions: { comision: 15, bonoInicial: 2.3, bonoSiniestral: 1.7, bonoRenovacion: 2.9, bonoCartera: 1.1, bonoIntegral: 2.7, udi: 1.3, intervita: 2.6, nova: 1.3 } },
  { id: '7', name: 'Hyundai Satélite', group: 'Grupo Premium Motors', armadora: 'Hyundai', location: 'Ciudad Satélite', state: 'Estado de México', manager: 'Emilio Navarrete Soto', sellers: 6, policies: 68, status: 'Activa', createdAt: '15/01/2024', commissions: { comision: 13, bonoInicial: 1.9, bonoSiniestral: 1.3, bonoRenovacion: 2.4, bonoCartera: 0.9, bonoIntegral: 2.1, udi: 1.1, intervita: 3.0, nova: 1.5 } },
  { id: '8', name: 'Chevrolet Guadalajara', group: 'Grupo Centro Occidente', armadora: 'Chevrolet', location: 'Guadalajara Centro', state: 'Jalisco', manager: 'Ramiro Zúñiga López', sellers: 11, policies: 134, status: 'Activa', createdAt: '22/01/2021', commissions: { comision: 14, bonoInicial: 2.1, bonoSiniestral: 1.6, bonoRenovacion: 2.7, bonoCartera: 1.0, bonoIntegral: 2.4, udi: 1.2, intervita: 2.9, nova: 1.4 } },
  { id: '9', name: 'Ford Zapopan', group: 'Grupo Centro Occidente', armadora: 'Ford', location: 'Zapopan', state: 'Jalisco', manager: 'Paulina Esquivel Cruz', sellers: 9, policies: 98, status: 'Activa', createdAt: '03/04/2022', commissions: { comision: 13, bonoInicial: 1.7, bonoSiniestral: 1.1, bonoRenovacion: 2.3, bonoCartera: 0.8, bonoIntegral: 2.3, udi: 1.0, intervita: 3.4, nova: 1.7 } },
  { id: '10', name: 'Kia Tonalá', group: 'Grupo Centro Occidente', armadora: 'Kia', location: 'Tonalá', state: 'Jalisco', manager: 'Gerardo Molina Fuentes', sellers: 5, policies: 52, status: 'Activa', createdAt: '18/11/2023', commissions: { comision: 12, bonoInicial: 1.5, bonoSiniestral: 1.0, bonoRenovacion: 2.0, bonoCartera: 0.8, bonoIntegral: 2.0, udi: 0.8, intervita: 4.0, nova: 2.0 } },
  { id: '11', name: 'Nissan Tlajomulco', group: 'Grupo Centro Occidente', armadora: 'Nissan', location: 'Tlajomulco', state: 'Jalisco', manager: 'Ximena Pacheco Aguirre', sellers: 8, policies: 87, status: 'Activa', createdAt: '05/05/2023', commissions: { comision: 14, bonoInicial: 2.0, bonoSiniestral: 1.5, bonoRenovacion: 2.6, bonoCartera: 1.0, bonoIntegral: 2.5, udi: 1.1, intervita: 2.7, nova: 1.3 } },
  { id: '12', name: 'Honda Providencia', group: 'Grupo Centro Occidente', armadora: 'Honda', location: 'Providencia', state: 'Jalisco', manager: 'Óscar Campos Hinojosa', sellers: 10, policies: 119, status: 'Activa', createdAt: '12/02/2022', commissions: { comision: 15, bonoInicial: 2.2, bonoSiniestral: 1.8, bonoRenovacion: 2.9, bonoCartera: 1.1, bonoIntegral: 2.6, udi: 1.3, intervita: 2.4, nova: 1.2 } },
  { id: '13', name: 'Toyota Mérida', group: 'Grupo Península', armadora: 'Toyota', location: 'Mérida', state: 'Yucatán', manager: 'Daniela Mendoza Ruiz', sellers: 7, policies: 76, status: 'Activa', createdAt: '12/10/2023', commissions: { comision: 14, bonoInicial: 2.0, bonoSiniestral: 1.4, bonoRenovacion: 2.8, bonoCartera: 1.0, bonoIntegral: 2.4, udi: 1.2, intervita: 3.1, nova: 1.5 } },
  { id: '14', name: 'VW Cancún', group: 'Grupo Península', armadora: 'Volkswagen', location: 'Cancún', state: 'Quintana Roo', manager: 'Alfonso Betancourt Lima', sellers: 6, policies: 64, status: 'Activa', createdAt: '08/03/2024', commissions: { comision: 13, bonoInicial: 1.8, bonoSiniestral: 1.2, bonoRenovacion: 2.5, bonoCartera: 0.9, bonoIntegral: 2.2, udi: 1.0, intervita: 3.3, nova: 1.6 } },
  { id: '15', name: 'Honda León', group: 'Grupo Bajío Motors', armadora: 'Honda', location: 'León', state: 'Guanajuato', manager: 'Fernando Vargas Osorio', sellers: 4, policies: 38, status: 'Inactiva', createdAt: '03/05/2022', commissions: { comision: 12, bonoInicial: 1.5, bonoSiniestral: 1.0, bonoRenovacion: 2.0, bonoCartera: 0.8, bonoIntegral: 2.0, udi: 0.8, intervita: 2.0, nova: 1.0 } },
  { id: '16', name: 'Mazda Querétaro', group: 'Grupo Bajío Motors', armadora: 'Mazda', location: 'Querétaro', state: 'Querétaro', manager: 'Lucía Guerrero Franco', sellers: 5, policies: 42, status: 'Activa', createdAt: '28/09/2022', commissions: { comision: 13, bonoInicial: 1.9, bonoSiniestral: 1.3, bonoRenovacion: 2.4, bonoCartera: 0.9, bonoIntegral: 2.3, udi: 1.1, intervita: 2.9, nova: 1.4 } },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AgencyStatus, string> = {
  Activa: 'bg-success hover:bg-success text-white',
  Inactiva: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

function formatMXN(value: number): string {
  return value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Commission Breakdown ─────────────────────────────────────────────────────

const COMMISSION_LABELS: { key: keyof AgencyCommissions; label: string }[] = [
  { key: 'comision', label: 'Comisión' },
  { key: 'bonoInicial', label: 'Bono Inicial' },
  { key: 'bonoSiniestral', label: 'Bono Siniestral' },
  { key: 'bonoRenovacion', label: 'Bono Renovación' },
  { key: 'bonoCartera', label: 'Bono Cartera' },
  { key: 'bonoIntegral', label: 'Bono Integral' },
  { key: 'udi', label: 'UDI' },
  { key: 'intervita', label: 'Partner' },
  { key: 'nova', label: 'NOVA' },
]

function CommissionBreakdown({ agency }: { agency: Agency }) {
  const [basePrima, setBasePrima] = useState(10000)
  const commissions = agency.commissions ?? DEFAULT_COMMISSIONS

  const ingresoKeys: (keyof AgencyCommissions)[] = ['comision', 'bonoInicial', 'bonoSiniestral', 'bonoRenovacion', 'bonoCartera', 'bonoIntegral', 'udi']
  const participacionKeys: (keyof AgencyCommissions)[] = ['intervita', 'nova']

  const totalIngreso = ingresoKeys.reduce((sum, key) => sum + (basePrima * commissions[key]) / 100, 0)
  const totalParticipacion = participacionKeys.reduce((sum, key) => sum + (basePrima * commissions[key]) / 100, 0)

  return (
    <div className="p-5 bg-slate-50/60 border-t space-y-4">
      {/* Panel header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Cómo se calcula cada concepto de comisión</p>
          <p className="text-xs text-muted-foreground">Modifica la prima base para ver cómo escala cada concepto.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-muted-foreground font-medium whitespace-nowrap">Prima base:</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">$</span>
            <Input
              type="number"
              min={0}
              step={1000}
              value={basePrima}
              onChange={(e) => setBasePrima(Math.max(0, Number(e.target.value)))}
              className="h-8 w-28 pl-6 text-sm font-mono bg-white"
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {COMMISSION_LABELS.map(({ key, label }) => {
          const pct = commissions[key]
          const result = (basePrima * pct) / 100
          return (
            <div
              key={key}
              className="bg-white rounded-lg border border-slate-200 p-3 space-y-1"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-primary font-mono">{pct.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Prima × {pct.toFixed(1)}%</p>
              <p className="text-sm font-semibold text-slate-700 font-mono">= ${formatMXN(result)} MXN</p>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <div className="flex-1 bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">Ingreso total estimado</span>
          <span className="text-sm font-bold text-primary font-mono">${formatMXN(totalIngreso)} MXN</span>
        </div>
        <div className="flex-1 bg-accent/5 border border-accent/15 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">Participaciones</span>
          <span className="text-sm font-bold text-accent font-mono">${formatMXN(totalParticipacion)} MXN</span>
        </div>
      </div>
    </div>
  )
}

// ─── New Agency Modal ─────────────────────────────────────────────────────────

function NewAgencyModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (agency: Agency) => void
}) {
  const [form, setForm] = useState({
    name: '',
    group: '',
    armadora: '',
    location: '',
    state: '',
  })
  const [commissions, setCommissions] = useState<AgencyCommissions>({ ...DEFAULT_COMMISSIONS })
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [userQuery, setUserQuery] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [groupQuery, setGroupQuery] = useState('')
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Candidate users: super_admin, group_lead, agency_manager (not sellers)
  const candidateUsers = INITIAL_USERS.filter(u =>
    u.role !== 'seller' && u.status === 'Activo'
  )

  const filteredUsers = userQuery.trim().length === 0
    ? candidateUsers
    : candidateUsers.filter(u =>
        u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userQuery.toLowerCase())
      )

  const filteredGroups = groupQuery.trim().length === 0
    ? MOCK_GROUPS
    : MOCK_GROUPS.filter(g => g.toLowerCase().includes(groupQuery.toLowerCase()))

  function updateField<K extends keyof typeof form>(field: K, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateCommission(field: keyof AgencyCommissions, value: string) {
    const parsed = parseFloat(value)
    setCommissions(prev => ({ ...prev, [field]: isNaN(parsed) ? 0 : parsed }))
  }

  function selectGroup(group: string) {
    updateField('group', group)
    setShowGroupDropdown(false)
    setGroupQuery('')
  }

  function clearSelectedGroup() {
    updateField('group', '')
    setGroupQuery('')
  }

  function selectUser(user: PlatformUser) {
    setSelectedUser(user)
    setShowUserDropdown(false)
    setUserQuery('')
  }

  function clearSelectedUser() {
    setSelectedUser(null)
  }

  const nameValid = form.name.trim().length >= 3
  const groupValid = form.group.trim().length > 0
  const armadoraValid = form.armadora !== ''
  const locationValid = form.location.trim().length >= 2
  const stateValid = form.state !== ''
  const managerValid = selectedUser !== null

  const isValid = nameValid && groupValid && armadoraValid && locationValid && stateValid && managerValid

  function handleSave() {
    setSubmitted(true)
    if (!isValid || !selectedUser) return

    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    onSave({
      id: String(Date.now()),
      name: form.name.trim(),
      group: form.group,
      armadora: form.armadora,
      location: form.location.trim(),
      state: form.state,
      manager: selectedUser.name,
      sellers: 0,
      policies: 0,
      status: 'Activa',
      createdAt: `${day}/${month}/${year}`,
      commissions: { ...commissions },
    })
  }

  const selectClass = 'flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  const commissionFields: { key: keyof AgencyCommissions; label: string }[] = [
    { key: 'comision', label: 'Comisión' },
    { key: 'bonoInicial', label: 'Bono Inicial' },
    { key: 'bonoSiniestral', label: 'Bono Siniestral' },
    { key: 'bonoRenovacion', label: 'Bono Renovación' },
    { key: 'bonoCartera', label: 'Bono Cartera' },
    { key: 'bonoIntegral', label: 'Bono Integral' },
    { key: 'udi', label: 'UDI' },
    { key: 'intervita', label: 'Partner' },
    { key: 'nova', label: 'NOVA' },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Nueva Agencia</h2>
            <p className="text-white/70 text-sm">Completa los datos para registrar la agencia</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label>Nombre de la agencia <span className="text-destructive">*</span></Label>
            <Input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej. Toyota Polanco"
              className={cn('h-11', submitted && !nameValid && 'border-destructive focus-visible:ring-destructive')}
            />
            {submitted && !nameValid && (
              <p className="text-xs text-destructive">El nombre debe tener al menos 3 caracteres.</p>
            )}
          </div>

          {/* Grupo - searchable */}
          <div className="space-y-1.5 relative">
            <Label>Grupo <span className="text-destructive">*</span></Label>
            {form.group ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-primary text-sm flex-1 truncate">{form.group}</p>
                <button
                  type="button"
                  onClick={clearSelectedGroup}
                  className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
                  title="Cambiar grupo"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={groupQuery}
                    onChange={(e) => { setGroupQuery(e.target.value); setShowGroupDropdown(true) }}
                    onFocus={() => setShowGroupDropdown(true)}
                    placeholder="Busca un grupo existente..."
                    className={cn('h-11 pl-9', submitted && !groupValid && 'border-destructive focus-visible:ring-destructive')}
                  />
                </div>
                {submitted && !groupValid && (
                  <p className="text-xs text-destructive">Selecciona un grupo existente.</p>
                )}
                {showGroupDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {filteredGroups.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground text-center">
                        No se encontraron grupos con &quot;{groupQuery}&quot;
                      </p>
                    ) : (
                      filteredGroups.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => selectGroup(g)}
                          className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                        >
                          <Building2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium text-primary text-sm truncate">{g}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Armadora */}
          <div className="space-y-1.5">
            <Label>Armadora <span className="text-destructive">*</span></Label>
            <select
              value={form.armadora}
              onChange={(e) => updateField('armadora', e.target.value)}
              className={cn(selectClass, submitted && !armadoraValid && 'border-destructive focus-visible:ring-destructive')}
            >
              <option value="">Selecciona una armadora</option>
              {AVAILABLE_ARMADORAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {submitted && !armadoraValid && (
              <p className="text-xs text-destructive">Selecciona una armadora.</p>
            )}
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ubicación <span className="text-destructive">*</span></Label>
              <Input
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Ej. Polanco"
                className={cn('h-11', submitted && !locationValid && 'border-destructive focus-visible:ring-destructive')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Estado <span className="text-destructive">*</span></Label>
              <select
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                className={cn(selectClass, submitted && !stateValid && 'border-destructive focus-visible:ring-destructive')}
              >
                <option value="">Selecciona</option>
                {MEXICAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Responsable - user picker */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary border-b pb-1.5">Responsable</p>

            {selectedUser ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {selectedUser.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-primary text-sm">{selectedUser.name}</p>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ROLE_BADGE_STYLES[selectedUser.role])}>
                      {ROLE_LABELS[selectedUser.role]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{selectedUser.email} · {selectedUser.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={clearSelectedUser}
                  className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
                  title="Cambiar usuario"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={userQuery}
                      onChange={(e) => { setUserQuery(e.target.value); setShowUserDropdown(true) }}
                      onFocus={() => setShowUserDropdown(true)}
                      placeholder="Busca por nombre o correo..."
                      className={cn('h-11 pl-9', submitted && !managerValid && 'border-destructive focus-visible:ring-destructive')}
                    />
                  </div>
                  {submitted && !managerValid && (
                    <p className="text-xs text-destructive">Selecciona un usuario existente como responsable.</p>
                  )}
                  {showUserDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      {filteredUsers.length === 0 ? (
                        <p className="p-3 text-sm text-muted-foreground text-center">
                          No se encontraron usuarios con &quot;{userQuery}&quot;
                        </p>
                      ) : (
                        filteredUsers.map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => selectUser(u)}
                            className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                              {u.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-primary text-sm truncate">{u.name}</p>
                                <span className={cn('text-[10px] px-1.5 py-0 rounded font-medium', ROLE_BADGE_STYLES[u.role])}>
                                  {ROLE_LABELS[u.role]}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                            <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Solo usuarios con rol <span className="font-medium">Super Nova</span>, <span className="font-medium">Responsable de Grupo</span> o <span className="font-medium">Responsable de Agencia</span>. Para crear un nuevo usuario, ve a Usuarios.
                </p>
              </>
            )}
          </div>

          {/* Configuración de comisiones */}
          <div className="space-y-3">
            <div className="border-b pb-1.5 flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-primary">Configuración de comisiones</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Define el porcentaje de cada concepto que se calcula sobre la prima.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {commissionFields.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={commissions[key]}
                      onChange={(e) => updateCommission(key, e.target.value)}
                      className="h-9 pr-7 text-sm"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3 justify-end bg-slate-50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-2">
            <Building2 className="w-4 h-4" />
            Guardar Agencia
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState<string>('Todos')
  const [armadoraFilter, setArmadoraFilter] = useState<string>('Todas')
  const [showNewAgency, setShowNewAgency] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const groups = useMemo(() => ['Todos', ...Array.from(new Set(agencies.map(a => a.group)))], [agencies])
  const armadoras = useMemo(() => ['Todas', ...Array.from(new Set(agencies.map(a => a.armadora))).sort()], [agencies])

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return agencies.filter((a) => {
      const matchesGroup = groupFilter === 'Todos' || a.group === groupFilter
      const matchesArmadora = armadoraFilter === 'Todas' || a.armadora === armadoraFilter
      const matchesSearch =
        !term ||
        a.name.toLowerCase().includes(term) ||
        a.group.toLowerCase().includes(term) ||
        a.armadora.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term) ||
        a.manager.toLowerCase().includes(term)
      return matchesGroup && matchesArmadora && matchesSearch
    })
  }, [search, groupFilter, armadoraFilter, agencies])

  const totalSellers = filtered.reduce((sum, a) => sum + a.sellers, 0)
  const totalPolicies = filtered.reduce((sum, a) => sum + a.policies, 0)

  function handleAddAgency(agency: Agency) {
    setAgencies(prev => [agency, ...prev])
    setShowNewAgency(false)
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Total columns: chevron + Agencia + Grupo + Armadora + Ubicación + Responsable + Vendedores + Pólizas + Estado + actions = 10
  const TABLE_COLS = 10

  const selectClass = 'flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Agencias</h1>
          <p className="text-muted-foreground mt-2">
            Agencias registradas en el sistema, agrupadas por su grupo y armadora.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto"
          onClick={() => setShowNewAgency(true)}
        >
          <Plus className="h-4 w-4" />
          Nueva Agencia
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{filtered.length}</p>
              <p className="text-xs text-muted-foreground">Agencias</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Wrench className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{armadoras.length - 1}</p>
              <p className="text-xs text-muted-foreground">Armadoras</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <UsersIcon className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalSellers}</p>
              <p className="text-xs text-muted-foreground">Vendedores</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Building2 className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalPolicies}</p>
              <p className="text-xs text-muted-foreground">Pólizas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle>Directorio de Agencias</CardTitle>
                <span className="text-sm text-muted-foreground font-normal">
                  {filtered.length} {filtered.length === 1 ? 'agencia' : 'agencias'}
                </span>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar agencia, grupo, armadora..."
                  className="pl-8 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium">Grupo:</label>
                <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className={selectClass}>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium">Armadora:</label>
                <select value={armadoraFilter} onChange={(e) => setArmadoraFilter(e.target.value)} className={selectClass}>
                  {armadoras.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-b-md border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Agencia</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Armadora</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-center">Vendedores</TableHead>
                  <TableHead className="text-center">Pólizas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={TABLE_COLS} className="text-center py-12 text-muted-foreground">
                      No se encontraron agencias con esos filtros.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((agency) => {
                  const isExpanded = expandedIds.has(agency.id)
                  return (
                    <Fragment key={agency.id}>
                      <TableRow
                        className={cn(
                          'hover:bg-slate-50/50 cursor-pointer select-none',
                          isExpanded && 'bg-slate-50/40'
                        )}
                        onClick={() => toggleExpand(agency.id)}
                      >
                        <TableCell className="pl-3 pr-0">
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-muted-foreground transition-transform duration-200',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-primary">{agency.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{agency.group}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-medium text-xs">
                            {agency.armadora}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{agency.location}</div>
                          <div className="text-xs text-muted-foreground">{agency.state}</div>
                        </TableCell>
                        <TableCell className="text-sm">{agency.manager}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-warning/10 text-warning text-xs font-semibold w-7 h-7">
                            {agency.sellers}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-success/10 text-success text-xs font-semibold w-8 h-7 px-1">
                            {agency.policies}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs font-medium', STATUS_STYLES[agency.status])}>
                            {agency.status}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={TABLE_COLS} className="p-0">
                            <CommissionBreakdown agency={agency} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Agency Modal */}
      {showNewAgency && (
        <NewAgencyModal
          onClose={() => setShowNewAgency(false)}
          onSave={handleAddAgency}
        />
      )}
    </div>
  )
}
