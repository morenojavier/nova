'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Search, Plus, MoreHorizontal, X, UserCog, Users, Shield, Building2, Briefcase } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'super_admin' | 'group_lead' | 'agency_manager' | 'seller'
type UserStatus = 'Activo' | 'Inactivo'

interface PlatformUser {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  group?: string
  agency?: string
  status: UserStatus
  createdAt: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GROUPS = [
  'Grupo Automotriz del Norte',
  'Grupo Premium Motors',
  'Grupo Centro Occidente',
  'Grupo Península',
  'Grupo Bajío Motors',
]

const MOCK_AGENCIES_BY_GROUP: Record<string, string[]> = {
  'Grupo Automotriz del Norte': ['Toyota Monterrey', 'Honda San Pedro', 'Nissan Apodaca', 'VW Cumbres'],
  'Grupo Premium Motors': ['Mazda Polanco', 'Toyota Santa Fe', 'Hyundai Satélite'],
  'Grupo Centro Occidente': ['Chevrolet Guadalajara', 'Ford Zapopan', 'Kia Tonalá', 'Nissan Tlajomulco', 'Honda Providencia'],
  'Grupo Península': ['Toyota Mérida', 'VW Cancún'],
  'Grupo Bajío Motors': ['Honda León', 'Mazda Querétaro'],
}

const INITIAL_USERS: PlatformUser[] = [
  // Super Admin
  {
    id: '1',
    name: 'Javier Moreno Castillo',
    email: 'javier.moreno@novaplataforma.mx',
    phone: '55 1000 0001',
    role: 'super_admin',
    status: 'Activo',
    createdAt: '01/01/2024',
  },
  // Group Leads
  {
    id: '2',
    name: 'Arturo Benítez Valencia',
    email: 'abenitez@gruponorte.mx',
    phone: '81 1234 5678',
    role: 'group_lead',
    group: 'Grupo Automotriz del Norte',
    status: 'Activo',
    createdAt: '15/03/2022',
  },
  {
    id: '3',
    name: 'Isabela Cruz Alarcón',
    email: 'icruz@premiummotors.mx',
    phone: '55 9876 5432',
    role: 'group_lead',
    group: 'Grupo Premium Motors',
    status: 'Activo',
    createdAt: '08/07/2023',
  },
  // Agency Managers
  {
    id: '4',
    name: 'Ricardo Peña Saucedo',
    email: 'rpsaucedo@gruponorte.mx',
    phone: '81 2345 6789',
    role: 'agency_manager',
    group: 'Grupo Automotriz del Norte',
    agency: 'Honda San Pedro',
    status: 'Activo',
    createdAt: '20/06/2022',
  },
  {
    id: '5',
    name: 'Paulina Esquivel Cruz',
    email: 'pesquivel@centrooccidente.mx',
    phone: '33 3456 7890',
    role: 'agency_manager',
    group: 'Grupo Centro Occidente',
    agency: 'Ford Zapopan',
    status: 'Activo',
    createdAt: '03/04/2022',
  },
  {
    id: '6',
    name: 'Daniela Mendoza Ruiz',
    email: 'dmendoza@peninsula.mx',
    phone: '99 3692 5814',
    role: 'agency_manager',
    group: 'Grupo Península',
    agency: 'Toyota Mérida',
    status: 'Activo',
    createdAt: '12/10/2023',
  },
  // Sellers
  {
    id: '7',
    name: 'Marco Antonio Fuentes Ríos',
    email: 'mfuentes@gruponorte.mx',
    phone: '81 4567 8901',
    role: 'seller',
    group: 'Grupo Automotriz del Norte',
    agency: 'Toyota Monterrey',
    status: 'Activo',
    createdAt: '10/04/2023',
  },
  {
    id: '8',
    name: 'Valentina Herrera Soto',
    email: 'vherrera@premiummotors.mx',
    phone: '55 5678 9012',
    role: 'seller',
    group: 'Grupo Premium Motors',
    agency: 'Mazda Polanco',
    status: 'Activo',
    createdAt: '22/08/2023',
  },
  {
    id: '9',
    name: 'Eduardo Salinas Bravo',
    email: 'esalinas@centrooccidente.mx',
    phone: '33 6789 0123',
    role: 'seller',
    group: 'Grupo Centro Occidente',
    agency: 'Chevrolet Guadalajara',
    status: 'Inactivo',
    createdAt: '05/11/2022',
  },
  {
    id: '10',
    name: 'Camila Torres Vega',
    email: 'ctorres@centrooccidente.mx',
    phone: '33 7890 1234',
    role: 'seller',
    group: 'Grupo Centro Occidente',
    agency: 'Honda Providencia',
    status: 'Activo',
    createdAt: '14/02/2024',
  },
  {
    id: '11',
    name: 'Rodrigo Navarro Leal',
    email: 'rnavarro@peninsula.mx',
    phone: '99 8901 2345',
    role: 'seller',
    group: 'Grupo Península',
    agency: 'VW Cancún',
    status: 'Activo',
    createdAt: '08/03/2024',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Nova',
  group_lead: 'Responsable de Grupo',
  agency_manager: 'Responsable de Agencia',
  seller: 'Vendedor',
}

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  super_admin: 'bg-primary text-white hover:bg-primary/90',
  group_lead: 'bg-accent text-white hover:bg-accent/90',
  agency_manager: 'bg-warning text-white hover:bg-warning/90',
  seller: 'bg-success text-white hover:bg-success/90',
}

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  super_admin: <Shield className="w-4 h-4" />,
  group_lead: <Users className="w-4 h-4" />,
  agency_manager: <Building2 className="w-4 h-4" />,
  seller: <Briefcase className="w-4 h-4" />,
}

const STATUS_STYLES: Record<UserStatus, string> = {
  Activo: 'bg-success/10 text-success border-transparent',
  Inactivo: 'bg-secondary text-secondary-foreground border-transparent',
}

// ─── New User Modal ───────────────────────────────────────────────────────────

function NewUserModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (user: PlatformUser) => void
}) {
  const [form, setForm] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    phone: '',
    role: 'seller' as UserRole,
    group: '',
    agency: '',
    status: 'Activo' as UserStatus,
  })

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Reset cascading fields when role or group changes
      if (field === 'role') {
        next.group = ''
        next.agency = ''
      }
      if (field === 'group') {
        next.agency = ''
      }
      return next
    })
  }

  const availableAgencies = form.group ? (MOCK_AGENCIES_BY_GROUP[form.group] ?? []) : []

  const fullName = `${form.firstName} ${form.paternalLastName} ${form.maternalLastName}`.trim()

  // Strict gating: group selector enabled only for group_lead; agency selector only for agency_manager
  const canSelectGroup = form.role === 'group_lead'
  const canSelectAgency = form.role === 'agency_manager'

  const isValid =
    form.firstName.trim().length >= 2 &&
    form.paternalLastName.trim().length >= 2 &&
    form.email.includes('@') &&
    form.phone.replace(/\D/g, '').length >= 10 &&
    (!canSelectGroup || form.group !== '') &&
    (!canSelectAgency || form.agency !== '')

  function handleSave() {
    onSave({
      id: String(Date.now()),
      name: fullName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      group: form.group || undefined,
      agency: form.agency || undefined,
      status: form.status,
      createdAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  const roles: UserRole[] = ['super_admin', 'group_lead', 'agency_manager', 'seller']

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Nuevo Usuario</h2>
            <p className="text-white/70 text-sm">Completa los datos para registrar al usuario</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Role selector */}
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <select
              value={form.role}
              onChange={(e) => update('role', e.target.value as UserRole)}
              className={selectClass}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {form.role === 'super_admin' && 'Acceso total al sistema'}
              {form.role === 'group_lead' && 'Administra un grupo'}
              {form.role === 'agency_manager' && 'Administra una agencia'}
              {form.role === 'seller' && 'Vendedor asignado a una agencia'}
            </p>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nombre(s)</Label>
              <Input
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Nombre"
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apellido paterno</Label>
              <Input
                value={form.paternalLastName}
                onChange={(e) => update('paternalLastName', e.target.value)}
                placeholder="Paterno"
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apellido materno</Label>
              <Input
                value={form.maternalLastName}
                onChange={(e) => update('maternalLastName', e.target.value)}
                placeholder="Materno"
                className="h-10"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Correo electrónico</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Teléfono</Label>
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

          {/* Group selector — only shown for group_lead */}
          {canSelectGroup && (
            <div className="space-y-1">
              <Label className="text-xs">Grupo</Label>
              <select
                value={form.group}
                onChange={(e) => update('group', e.target.value)}
                className={selectClass}
              >
                <option value="">Selecciona un grupo</option>
                {MOCK_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          {/* Agency selector — only shown for agency_manager */}
          {canSelectAgency && (
            <div className="space-y-1">
              <Label className="text-xs">Agencia</Label>
              <select
                value={form.agency}
                onChange={(e) => update('agency', e.target.value)}
                className={selectClass}
              >
                <option value="">Selecciona una agencia</option>
                {Object.values(MOCK_AGENCIES_BY_GROUP).flat().map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status toggle */}
          <div className="space-y-2">
            <Label className="text-xs">Estado</Label>
            <div className="flex gap-2">
              {(['Activo', 'Inactivo'] as UserStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('status', s)}
                  className={cn(
                    'flex-1 py-2 rounded-xl border text-sm font-semibold transition-all',
                    form.status === s
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3 justify-end bg-slate-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="gap-2">
            <UserCog className="w-4 h-4" />
            Guardar Usuario
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showNewUser, setShowNewUser] = useState(false)

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return users.filter((u) => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phone.includes(term) ||
        ROLE_LABELS[u.role].toLowerCase().includes(term)
      return matchesRole && matchesSearch
    })
  }, [users, search, roleFilter])

  // Stats
  const totalUsers = users.length
  const superAdmins = users.filter(u => u.role === 'super_admin').length
  const managers = users.filter(u => u.role === 'group_lead' || u.role === 'agency_manager').length
  const sellers = users.filter(u => u.role === 'seller').length

  function handleAddUser(user: PlatformUser) {
    setUsers(prev => [user, ...prev])
    setShowNewUser(false)
  }

  const selectClass =
    'flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todos los usuarios de la plataforma y sus roles asignados.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto"
          onClick={() => setShowNewUser(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total usuarios</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{superAdmins}</p>
              <p className="text-xs text-muted-foreground">Super Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{managers}</p>
              <p className="text-xs text-muted-foreground">Responsables</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Briefcase className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{sellers}</p>
              <p className="text-xs text-muted-foreground">Vendedores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Directorio</CardTitle>
                <span className="text-sm text-muted-foreground font-normal">
                  {filtered.length} {filtered.length === 1 ? 'usuario' : 'usuarios'}
                </span>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, correo, rol..."
                  className="pl-8 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar usuarios"
                />
              </div>
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground font-medium shrink-0">Rol:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className={selectClass}
                aria-label="Filtrar por rol"
              >
                <option value="all">Todos</option>
                <option value="super_admin">Super Admin</option>
                <option value="group_lead">Responsable de Grupo</option>
                <option value="agency_manager">Responsable de Agencia</option>
                <option value="seller">Vendedor</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-b-md border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Pertenece a</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No se encontraron usuarios con ese criterio de búsqueda.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                          {user.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-primary">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs font-medium gap-1', ROLE_BADGE_STYLES[user.role])}>
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.agency ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.agency}</p>
                          <p className="text-xs text-muted-foreground">{user.group}</p>
                        </div>
                      ) : user.group ? (
                        <p className="text-sm font-medium text-foreground">{user.group}</p>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs font-medium', STATUS_STYLES[user.status])}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        aria-label={`Acciones para ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New User Modal */}
      {showNewUser && (
        <NewUserModal
          onClose={() => setShowNewUser(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  )
}
