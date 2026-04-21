'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Search, ChevronDown, Plus, MoreHorizontal, X, Building2, Wrench, UserCheck } from 'lucide-react'
import { INITIAL_USERS, ROLE_LABELS, ROLE_BADGE_STYLES, type PlatformUser } from '@/features/users/data/users'

// ─── Types ────────────────────────────────────────────────────────────────────

type GroupStatus = 'Activo' | 'Inactivo'

interface Group {
  id: string
  name: string
  leader: string
  email: string
  phone: string
  agencies: string[]
  armadoras: string[]
  status: GroupStatus
  createdAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVAILABLE_ARMADORAS = [
  'Toyota', 'Honda', 'Nissan', 'Volkswagen', 'Mazda',
  'Hyundai', 'Chevrolet', 'Ford', 'Kia',
]

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Grupo Automotriz del Norte',
    leader: 'Arturo Benítez Valencia',
    email: 'abenitez@gruponorte.mx',
    phone: '81 1234 5678',
    agencies: ['Toyota Monterrey', 'Honda San Pedro', 'Nissan Apodaca', 'VW Cumbres'],
    armadoras: ['Toyota', 'Honda', 'Nissan', 'Volkswagen'],
    status: 'Activo',
    createdAt: '15/03/2022',
  },
  {
    id: '2',
    name: 'Grupo Premium Motors',
    leader: 'Isabela Cruz Alarcón',
    email: 'icruz@premiummotors.mx',
    phone: '55 9876 5432',
    agencies: ['Mazda Polanco', 'Toyota Santa Fe', 'Hyundai Satélite'],
    armadoras: ['Mazda', 'Toyota', 'Hyundai'],
    status: 'Activo',
    createdAt: '08/07/2023',
  },
  {
    id: '3',
    name: 'Grupo Centro Occidente',
    leader: 'Ramiro Zúñiga López',
    email: 'rzuniga@centrooccidente.mx',
    phone: '33 2468 1357',
    agencies: ['Chevrolet Guadalajara', 'Ford Zapopan', 'Kia Tonalá', 'Nissan Tlajomulco', 'Honda Providencia'],
    armadoras: ['Chevrolet', 'Ford', 'Kia', 'Nissan', 'Honda'],
    status: 'Activo',
    createdAt: '22/01/2021',
  },
  {
    id: '4',
    name: 'Grupo Península',
    leader: 'Daniela Mendoza Ruiz',
    email: 'dmendoza@peninsula.mx',
    phone: '99 3692 5814',
    agencies: ['Toyota Mérida', 'VW Cancún'],
    armadoras: ['Toyota', 'Volkswagen'],
    status: 'Activo',
    createdAt: '12/10/2023',
  },
  {
    id: '5',
    name: 'Grupo Bajío Motors',
    leader: 'Fernando Vargas Osorio',
    email: 'fvargas@bajiomotors.mx',
    phone: '47 1592 6483',
    agencies: ['Honda León', 'Mazda Querétaro'],
    armadoras: ['Honda', 'Mazda'],
    status: 'Inactivo',
    createdAt: '03/05/2022',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<GroupStatus, string> = {
  Activo: 'bg-success hover:bg-success text-white',
  Inactivo: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

// ─── Sub-component: Expanded Panel ───────────────────────────────────────────

function GroupDetailPanel({ group }: { group: Group }) {
  return (
    <div className="px-6 py-4 bg-slate-50/60 border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agencias */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-accent" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              Agencias ({group.agencies.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.agencies.map(a => (
              <Badge key={a} variant="outline" className="bg-accent/5 text-accent border-accent/20 font-medium">
                {a}
              </Badge>
            ))}
          </div>
        </div>

        {/* Armadoras */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              Armadoras ({group.armadoras.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.armadoras.map(a => (
              <Badge key={a} variant="outline" className="bg-primary/5 text-primary border-primary/20 font-medium">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Responsable</p>
          <p className="font-medium text-primary mt-0.5">{group.leader}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Correo</p>
          <p className="font-medium mt-0.5">{group.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Teléfono</p>
          <p className="font-medium mt-0.5">{group.phone}</p>
        </div>
      </div>
    </div>
  )
}

// ─── New Group Modal ──────────────────────────────────────────────────────────

function NewGroupModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (group: Group) => void
}) {
  const [form, setForm] = useState({
    name: '',
    leader: '',
    email: '',
    phone: '',
  })
  const [selectedArmadoras, setSelectedArmadoras] = useState<string[]>([])
  const [armadoraList, setArmadoraList] = useState<string[]>(AVAILABLE_ARMADORAS)
  const [newArmadoraName, setNewArmadoraName] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [userQuery, setUserQuery] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Filter candidates: can be super_admin, group_lead, agency_manager (not sellers)
  const candidateUsers = INITIAL_USERS.filter(u =>
    u.role !== 'seller' && u.status === 'Activo'
  )

  const filteredUsers = userQuery.trim().length === 0
    ? candidateUsers
    : candidateUsers.filter(u =>
        u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userQuery.toLowerCase())
      )

  function selectUser(user: PlatformUser) {
    setSelectedUser(user)
    setForm(prev => ({
      ...prev,
      leader: user.name,
      email: user.email,
      phone: user.phone,
    }))
    setShowUserDropdown(false)
    setUserQuery('')
  }

  function clearSelectedUser() {
    setSelectedUser(null)
    setForm(prev => ({ ...prev, leader: '', email: '', phone: '' }))
  }

  function updateField<K extends keyof typeof form>(field: K, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addArmadora(armadora: string) {
    if (!selectedArmadoras.includes(armadora)) {
      setSelectedArmadoras(prev => [...prev, armadora])
    }
  }

  function removeArmadora(armadora: string) {
    setSelectedArmadoras(prev => prev.filter(a => a !== armadora))
  }

  function handleAddNewArmadora() {
    const trimmed = newArmadoraName.trim()
    if (trimmed.length < 2) return
    // Check if already exists (case-insensitive)
    const existing = armadoraList.find(a => a.toLowerCase() === trimmed.toLowerCase())
    const finalName = existing ?? trimmed
    // Add to global list if new
    if (!existing) {
      setArmadoraList(prev => [...prev, trimmed])
    }
    // Add to selected
    addArmadora(finalName)
    setNewArmadoraName('')
    setShowAddNew(false)
  }

  const nameValid = form.name.trim().length >= 3
  const leaderValid = form.leader.trim().length >= 2
  const armadorasValid = selectedArmadoras.length > 0

  const isValid = nameValid && leaderValid && armadorasValid

  function handleSave() {
    setSubmitted(true)
    if (!isValid) return

    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    onSave({
      id: String(Date.now()),
      name: form.name.trim(),
      leader: form.leader.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      agencies: [],
      armadoras: selectedArmadoras,
      status: 'Activo',
      createdAt: `${day}/${month}/${year}`,
    })
  }

  const availableToAdd = armadoraList.filter(a => !selectedArmadoras.includes(a))

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Nuevo Grupo</h2>
            <p className="text-white/70 text-sm">Completa los datos para registrar el grupo</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Nombre del grupo */}
          <div className="space-y-1.5">
            <Label htmlFor="group-name">
              Nombre del grupo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="group-name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej. Grupo Automotriz del Sur"
              className={cn(
                'h-11',
                submitted && !nameValid && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {submitted && !nameValid && (
              <p className="text-xs text-destructive">El nombre debe tener al menos 3 caracteres.</p>
            )}
          </div>

          {/* Responsable */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary border-b pb-1.5">Responsable</p>

            {selectedUser ? (
              /* Selected user card */
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
                {/* Search user */}
                <div className="space-y-1.5 relative">
                  <Label>Buscar usuario <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={userQuery}
                      onChange={(e) => { setUserQuery(e.target.value); setShowUserDropdown(true) }}
                      onFocus={() => setShowUserDropdown(true)}
                      placeholder="Busca por nombre o correo..."
                      className={cn(
                        'h-11 pl-9',
                        submitted && !leaderValid && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                  </div>
                  {submitted && !leaderValid && (
                    <p className="text-xs text-destructive">Selecciona un usuario existente como responsable.</p>
                  )}

                  {/* Dropdown */}
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
                  Solo aparecen usuarios con rol <span className="font-medium">Super Nova</span>, <span className="font-medium">Responsable de Grupo</span> o <span className="font-medium">Responsable de Agencia</span>. Para agregar un nuevo usuario, ve a la sección Usuarios.
                </p>
              </>
            )}
          </div>

          {/* Armadoras */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary border-b pb-1.5">Armadoras</p>

            {/* Selected chips */}
            {selectedArmadoras.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedArmadoras.map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeArmadora(a)}
                      className="rounded-full hover:bg-primary/20 transition-colors p-0.5"
                      aria-label={`Quitar ${a}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Select dropdown to add existing armadoras */}
            {!showAddNew && (
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addArmadora(e.target.value)
                    }
                  }}
                  className="flex-1 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  disabled={availableToAdd.length === 0}
                >
                  <option value="">
                    {availableToAdd.length === 0
                      ? 'Todas las armadoras están seleccionadas'
                      : 'Selecciona una armadora...'}
                  </option>
                  {availableToAdd.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddNew(true)}
                  className="gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Nueva
                </Button>
              </div>
            )}

            {/* Add new armadora inline form */}
            {showAddNew && (
              <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Input
                  autoFocus
                  value={newArmadoraName}
                  onChange={(e) => setNewArmadoraName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddNewArmadora()
                    }
                    if (e.key === 'Escape') {
                      setShowAddNew(false)
                      setNewArmadoraName('')
                    }
                  }}
                  placeholder="Nombre de la armadora"
                  className="h-9"
                />
                <Button
                  type="button"
                  onClick={handleAddNewArmadora}
                  disabled={newArmadoraName.trim().length < 2}
                  size="sm"
                >
                  Agregar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowAddNew(false); setNewArmadoraName('') }}
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            )}

            {submitted && !armadorasValid && (
              <p className="text-xs text-destructive">Selecciona al menos una armadora.</p>
            )}
            {!submitted && selectedArmadoras.length === 0 && (
              <p className="text-xs text-muted-foreground">Selecciona al menos una armadora. Si no encuentras la que buscas, puedes agregar una nueva.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3 justify-end bg-slate-50">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-2">
            <Building2 className="w-4 h-4" />
            Guardar Grupo
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS)
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [showNewGroup, setShowNewGroup] = useState(false)

  const filtered = groups.filter((g) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    return (
      g.name.toLowerCase().includes(term) ||
      g.leader.toLowerCase().includes(term) ||
      g.agencies.some(a => a.toLowerCase().includes(term)) ||
      g.armadoras.some(a => a.toLowerCase().includes(term))
    )
  })

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddGroup(group: Group) {
    setGroups(prev => [group, ...prev])
    setShowNewGroup(false)
  }

  const totalAgencies = groups.reduce((sum, g) => sum + g.agencies.length, 0)
  const totalArmadoras = new Set(groups.flatMap(g => g.armadoras)).size

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Grupos</h1>
          <p className="text-muted-foreground mt-2">
            Organizaciones que gestionan agencias y armadoras dentro del sistema.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto"
          onClick={() => setShowNewGroup(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo Grupo
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{groups.length}</p>
              <p className="text-xs text-muted-foreground">Grupos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalAgencies}</p>
              <p className="text-xs text-muted-foreground">Agencias</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Wrench className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalArmadoras}</p>
              <p className="text-xs text-muted-foreground">Armadoras</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Directorio de Grupos</CardTitle>
              <span className="text-sm text-muted-foreground font-normal">
                {filtered.length} {filtered.length === 1 ? 'grupo' : 'grupos'}
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, agencia o armadora..."
                className="pl-8 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-b-md border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-4 w-8" />
                  <TableHead>Nombre del Grupo</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-center">Agencias</TableHead>
                  <TableHead className="text-center">Armadoras</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No se encontraron grupos con ese criterio.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((group) => {
                  const isExpanded = expandedIds.has(group.id)
                  return (
                    <>
                      <TableRow
                        key={group.id}
                        className={cn(
                          'hover:bg-slate-50/50 cursor-pointer transition-colors',
                          isExpanded && 'bg-slate-50/40'
                        )}
                        onClick={() => toggleExpand(group.id)}
                      >
                        <TableCell className="pl-4 pr-0 w-8">
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 text-muted-foreground transition-transform duration-200',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-primary">{group.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{group.leader}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-semibold w-7 h-7">
                            {group.agencies.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold w-7 h-7">
                            {group.armadoras.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs font-medium', STATUS_STYLES[group.status])}>
                            {group.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{group.createdAt}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow key={`${group.id}-detail`} className="hover:bg-transparent">
                          <TableCell colSpan={8} className="p-0">
                            <GroupDetailPanel group={group} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Group Modal */}
      {showNewGroup && (
        <NewGroupModal
          onClose={() => setShowNewGroup(false)}
          onSave={handleAddGroup}
        />
      )}
    </div>
  )
}
