'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, Plus, MoreHorizontal, UserCog, TrendingUp, DollarSign, FileText } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type SellerStatus = 'Activo' | 'Inactivo'

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
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SELLERS: Seller[] = [
  { id: '1', name: 'Andrés Solís Montaño', email: 'asolis@toyotamty.mx', phone: '81 1234 0001', agency: 'Toyota Monterrey', group: 'Grupo Automotriz del Norte', sales: 286400, commission: 42960, policiesSold: 34, status: 'Activo', startDate: '12/04/2022' },
  { id: '2', name: 'Marisol Acevedo Paz', email: 'macevedo@toyotamty.mx', phone: '81 1234 0002', agency: 'Toyota Monterrey', group: 'Grupo Automotriz del Norte', sales: 218900, commission: 32835, policiesSold: 28, status: 'Activo', startDate: '03/09/2023' },
  { id: '3', name: 'Javier Canales Ruiz', email: 'jcanales@hondasp.mx', phone: '81 5678 0010', agency: 'Honda San Pedro', group: 'Grupo Automotriz del Norte', sales: 174500, commission: 26175, policiesSold: 22, status: 'Activo', startDate: '20/01/2024' },
  { id: '4', name: 'Carolina Estrada Vivas', email: 'cestrada@hondasp.mx', phone: '81 5678 0011', agency: 'Honda San Pedro', group: 'Grupo Automotriz del Norte', sales: 89300, commission: 13395, policiesSold: 12, status: 'Inactivo', startDate: '05/11/2023' },
  { id: '5', name: 'Pablo Trejo Ortega', email: 'ptrejo@nissanapd.mx', phone: '81 2468 0020', agency: 'Nissan Apodaca', group: 'Grupo Automotriz del Norte', sales: 241200, commission: 36180, policiesSold: 31, status: 'Activo', startDate: '08/06/2023' },
  { id: '6', name: 'Gabriela Sosa Mendoza', email: 'gsosa@mazdapol.mx', phone: '55 9876 0030', agency: 'Mazda Polanco', group: 'Grupo Premium Motors', sales: 312800, commission: 46920, policiesSold: 38, status: 'Activo', startDate: '15/02/2022' },
  { id: '7', name: 'Eduardo Cárdenas Islas', email: 'ecardenas@mazdapol.mx', phone: '55 9876 0031', agency: 'Mazda Polanco', group: 'Grupo Premium Motors', sales: 195600, commission: 29340, policiesSold: 24, status: 'Activo', startDate: '01/10/2023' },
  { id: '8', name: 'Natalia Zepeda Luna', email: 'nzepeda@toyotasf.mx', phone: '55 3456 0040', agency: 'Toyota Santa Fe', group: 'Grupo Premium Motors', sales: 408500, commission: 61275, policiesSold: 51, status: 'Activo', startDate: '20/03/2021' },
  { id: '9', name: 'Roberto Fierro Quiroz', email: 'rfierro@toyotasf.mx', phone: '55 3456 0041', agency: 'Toyota Santa Fe', group: 'Grupo Premium Motors', sales: 287900, commission: 43185, policiesSold: 35, status: 'Activo', startDate: '14/07/2022' },
  { id: '10', name: 'Alejandra Nieto Serna', email: 'anieto@hyundaisat.mx', phone: '55 6789 0050', agency: 'Hyundai Satélite', group: 'Grupo Premium Motors', sales: 156400, commission: 23460, policiesSold: 19, status: 'Activo', startDate: '28/04/2024' },
  { id: '11', name: 'Iván Murillo Tapia', email: 'imurillo@chevgdl.mx', phone: '33 1111 0060', agency: 'Chevrolet Guadalajara', group: 'Grupo Centro Occidente', sales: 268700, commission: 40305, policiesSold: 32, status: 'Activo', startDate: '09/08/2022' },
  { id: '12', name: 'Verónica Ibáñez Castro', email: 'vibanez@fordzpn.mx', phone: '33 2222 0070', agency: 'Ford Zapopan', group: 'Grupo Centro Occidente', sales: 192100, commission: 28815, policiesSold: 24, status: 'Activo', startDate: '18/11/2023' },
  { id: '13', name: 'Sergio Barrón Delgado', email: 'sbarron@kiatonala.mx', phone: '33 3333 0080', agency: 'Kia Tonalá', group: 'Grupo Centro Occidente', sales: 104500, commission: 15675, policiesSold: 14, status: 'Activo', startDate: '01/02/2024' },
  { id: '14', name: 'Regina Villafaña Olmos', email: 'rvillafana@toyotamer.mx', phone: '99 4444 0090', agency: 'Toyota Mérida', group: 'Grupo Península', sales: 172300, commission: 25845, policiesSold: 21, status: 'Activo', startDate: '12/12/2023' },
  { id: '15', name: 'Mauricio Pérez Galindo', email: 'mperez@vwcun.mx', phone: '99 5555 0100', agency: 'VW Cancún', group: 'Grupo Península', sales: 128900, commission: 19335, policiesSold: 16, status: 'Activo', startDate: '25/03/2024' },
  { id: '16', name: 'Karla Vázquez Romero', email: 'kvazquez@mazdaqro.mx', phone: '44 6666 0110', agency: 'Mazda Querétaro', group: 'Grupo Bajío Motors', sales: 112400, commission: 16860, policiesSold: 14, status: 'Activo', startDate: '07/01/2023' },
]

const STATUS_STYLES: Record<SellerStatus, string> = {
  Activo: 'bg-success hover:bg-success text-white',
  Inactivo: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

const formatMXN = (n: number) => '$' + n.toLocaleString('es-MX')

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SellersPage() {
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

  const selectClass = 'flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Vendedores</h1>
          <p className="text-muted-foreground mt-2">
            Asesores que pertenecen a las agencias. Consulta su desempeño y pólizas generadas.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Nuevo Vendedor
        </Button>
      </div>

      {/* Summary */}
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

      {/* Table */}
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
                  placeholder="Buscar por nombre, correo, agencia..."
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
          <div className="rounded-b-md border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Agencia</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead className="text-center">Pólizas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No se encontraron vendedores con esos filtros.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((seller) => (
                  <TableRow key={seller.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-primary">{seller.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{seller.email}</div>
                      <div className="text-xs text-muted-foreground">{seller.phone}</div>
                    </TableCell>
                    <TableCell className="text-sm">{seller.agency}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{seller.group}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatMXN(seller.sales)}</TableCell>
                    <TableCell className="text-right font-semibold text-success">{formatMXN(seller.commission)}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-warning/10 text-warning text-xs font-semibold w-7 h-7">
                        {seller.policiesSold}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs font-medium', STATUS_STYLES[seller.status])}>
                        {seller.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
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
    </div>
  )
}
