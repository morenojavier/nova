'use client'

import { useRef, useState } from 'react'
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
import { cn } from '@/lib/utils'
import {
    Truck,
    Plus,
    ArrowLeft,
    Search,
    Calendar,
    TrendingUp,
    Clock,
    Building2,
    FileText,
    Upload,
    IdCard,
    FileQuestion,
    X,
    CheckCircle2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FleetStatus = 'Vigente' | 'Por Vencer' | 'Vencida'
type VehicleStatus = 'Activo' | 'Baja'

interface Vehicle {
    id: string
    brand: string
    model: string
    year: number
    plates: string
    vin: string
    status: VehicleStatus
}

interface HistoryEvent {
    date: string
    title: string
    description: string
    type: 'vehicle_add' | 'vehicle_remove' | 'insurer_change' | 'renewal' | 'premium_adjust' | 'creation'
}

interface LegalData {
    curp?: string
    folioMercantil?: string
    rfc?: string
    legalRepresentative?: string
    fiscalAddress?: string
    identificationType?: 'INE' | 'Pasaporte'
    identificationNumber?: string
    identificationImage?: string
    actaConstitutiva?: string
    poderes?: string
    constanciaFiscal?: string
}

interface Fleet {
    id: string
    company: string
    insurer: string
    insurerInitials: string
    insurerColor: string
    policyNumber: string
    vehicleCount: number
    premium: string
    status: FleetStatus
    startDate: string
    endDate: string | null
    vehicles: Vehicle[]
    history: HistoryEvent[]
    group?: string
    legal?: LegalData
}

// ─── Insurer catalog ──────────────────────────────────────────────────────────

interface InsurerOption {
    name: string
    initials: string
    color: string
}

const INSURERS: InsurerOption[] = [
    { name: 'GNP Seguros',  initials: 'GNP', color: 'bg-green-700' },
    { name: 'CHUBB',        initials: 'CHB', color: 'bg-indigo-600' },
    { name: 'HDI Seguros',  initials: 'HDI', color: 'bg-teal-700' },
    { name: 'Quálitas',     initials: 'QU',  color: 'bg-red-700' },
    { name: 'Mapfre',       initials: 'MA',  color: 'bg-rose-700' },
    { name: 'Zurich',       initials: 'ZUR', color: 'bg-emerald-600' },
    { name: 'AXA Seguros',  initials: 'AXA', color: 'bg-blue-600' },
]

const GROUPS = [
    'Grupo Automotriz del Norte',
    'Grupo Premium Motors',
    'Grupo Centro Occidente',
    'Grupo Península',
    'Grupo Bajío Motors',
]

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_FLEETS: Fleet[] = [
    {
        id: '1',
        company: 'Empresa Logistics SA de CV',
        insurer: 'AXA Seguros',
        insurerInitials: 'AXA',
        insurerColor: 'bg-blue-600',
        policyNumber: 'AXA-2024-003291',
        vehicleCount: 8,
        premium: '$48,000',
        status: 'Vencida',
        startDate: '15/03/2022',
        endDate: '15/03/2024',
        group: 'Grupo Logistics MX',
        legal: {
            curp: 'LOGS850615HDFRRC08',
            folioMercantil: 'FME-2015-084521',
            rfc: 'LOG850615XK1',
            legalRepresentative: 'Arturo Benítez Valencia',
            fiscalAddress: 'Av. Industrial 1245, Col. Parque Industrial, San Nicolás, Nuevo León, CP 66450',
            identificationType: 'INE',
            identificationNumber: 'BNVLAR85061519H300',
            identificationImage: 'ine_arturo_benitez.jpg',
            actaConstitutiva: 'acta_constitutiva_logistics_2015.pdf',
            poderes: 'poderes_logistics_2020.pdf',
            constanciaFiscal: 'csf_logistics_2025.pdf',
        },
        vehicles: [
            { id: 'v1', brand: 'Nissan', model: 'NP300 Frontier', year: 2021, plates: 'TGH-78-42', vin: '3N6AD33A01K812345', status: 'Activo' },
            { id: 'v2', brand: 'Ford', model: 'Transit', year: 2020, plates: 'RLM-91-07', vin: '1FTBR1Y80LKA12345', status: 'Activo' },
            { id: 'v3', brand: 'Chevrolet', model: 'Express 2500', year: 2019, plates: 'PLX-44-19', vin: '1GCWGFCA1K1123456', status: 'Activo' },
            { id: 'v4', brand: 'Mercedes-Benz', model: 'Sprinter 313', year: 2022, plates: 'KVT-55-83', vin: 'WD3PE8CD8JP123456', status: 'Baja' },
            { id: 'v5', brand: 'Toyota', model: 'Hiace', year: 2021, plates: 'NMQ-23-61', vin: 'JTFSX22P5G4123456', status: 'Activo' },
        ],
        history: [
            { date: '15/03/2024', title: 'Póliza vencida', description: 'La póliza AXA-2024-003291 llegó a su fecha de vencimiento sin renovación.', type: 'renewal' },
            { date: '10/01/2024', title: 'Ajuste de prima', description: 'Prima anual ajustada de $44,000 a $48,000 por incremento de cobertura.', type: 'premium_adjust' },
            { date: '05/09/2023', title: '1 vehículo dado de baja', description: 'Mercedes-Benz Sprinter 313 (KVT-55-83) dado de baja por siniestro total.', type: 'vehicle_remove' },
            { date: '01/08/2023', title: '+2 vehículos agregados', description: 'Se agregaron Toyota Hiace (NMQ-23-61) y Nissan NP300 Frontier (TGH-78-42).', type: 'vehicle_add' },
            { date: '15/03/2023', title: 'Renovación anual', description: 'Póliza renovada por un año. Prima ajustada a $44,000.', type: 'renewal' },
            { date: '15/03/2022', title: 'Flotilla creada', description: 'Alta de flotilla con 5 unidades iniciales bajo AXA Seguros.', type: 'creation' },
        ],
    },
    {
        id: '2',
        company: 'Transportes Rápidos del Norte',
        insurer: 'AXA Seguros',
        insurerInitials: 'AXA',
        insurerColor: 'bg-blue-600',
        policyNumber: 'AXA-2023-011220',
        vehicleCount: 15,
        premium: '$62,400',
        status: 'Vencida',
        startDate: '01/06/2021',
        endDate: '01/06/2023',
        vehicles: [
            { id: 'v6', brand: 'Kenworth', model: 'T370', year: 2020, plates: 'ZRQ-11-54', vin: '2XKFDB9X4DM123456', status: 'Activo' },
            { id: 'v7', brand: 'International', model: 'ProStar 122', year: 2019, plates: 'BFH-66-30', vin: '3HSCUAPR4EN123456', status: 'Activo' },
            { id: 'v8', brand: 'Freightliner', model: 'Cascadia 126', year: 2021, plates: 'WJV-48-95', vin: '3AKJGLD54FSGA1234', status: 'Activo' },
            { id: 'v9', brand: 'Volvo', model: 'FH 460', year: 2018, plates: 'DPL-37-72', vin: 'YV2RT20A2BA123456', status: 'Baja' },
        ],
        history: [
            { date: '01/06/2023', title: 'Póliza vencida', description: 'La póliza AXA-2023-011220 venció. El cliente no renovó.', type: 'renewal' },
            { date: '15/02/2023', title: 'Ajuste de prima', description: 'Prima incrementada de $58,000 a $62,400 por revisión actuarial.', type: 'premium_adjust' },
            { date: '20/10/2022', title: '1 vehículo dado de baja', description: 'Volvo FH 460 (DPL-37-72) dado de baja por fin de vida útil.', type: 'vehicle_remove' },
            { date: '01/06/2022', title: 'Renovación anual', description: 'Segunda renovación de póliza por un año. Prima $58,000.', type: 'renewal' },
            { date: '10/12/2021', title: '+3 vehículos agregados', description: 'Incorporación de 3 unidades Kenworth T370 a la flotilla.', type: 'vehicle_add' },
            { date: '01/06/2021', title: 'Flotilla creada', description: 'Alta inicial con 12 unidades de carga pesada bajo AXA Seguros.', type: 'creation' },
        ],
    },
    {
        id: '3',
        company: 'Grupo Industrial León SA',
        insurer: 'Zurich',
        insurerInitials: 'ZUR',
        insurerColor: 'bg-emerald-600',
        policyNumber: 'ZUR-2024-000945',
        vehicleCount: 5,
        premium: '$38,500',
        status: 'Vigente',
        startDate: '01/11/2024',
        endDate: null,
        group: 'Grupo Industrial León',
        legal: {
            curp: 'GILG720304HGTNNR07',
            folioMercantil: 'FME-2009-031884',
            rfc: 'GIL720304QP2',
            legalRepresentative: 'Norma Patricia Guerrero Illán',
            fiscalAddress: 'Blvd. Adolfo López Mateos 540, Col. Centro, León, Guanajuato, CP 37000',
            identificationType: 'Pasaporte',
            identificationNumber: 'G32041907',
            identificationImage: 'pasaporte_norma_guerrero.jpg',
            actaConstitutiva: 'acta_constitutiva_gil_2009.pdf',
            constanciaFiscal: 'csf_gil_2025.pdf',
        },
        vehicles: [
            { id: 'v10', brand: 'Toyota', model: 'Hilux', year: 2023, plates: 'GNX-82-16', vin: 'MR0EX32G100123456', status: 'Activo' },
            { id: 'v11', brand: 'Ford', model: 'Ranger XLT', year: 2022, plates: 'CJM-59-40', vin: '1FTER4EH8NLD12345', status: 'Activo' },
            { id: 'v12', brand: 'Chevrolet', model: 'S10', year: 2021, plates: 'HBT-74-28', vin: '8LNXTF3EXMG123456', status: 'Activo' },
        ],
        history: [
            { date: '15/03/2025', title: 'Ajuste de prima', description: 'Prima revisada y ajustada de $36,000 a $38,500 para el año en curso.', type: 'premium_adjust' },
            { date: '01/11/2024', title: 'Flotilla creada', description: 'Alta de flotilla con 3 vehículos bajo Zurich Seguros. Cambio desde GNP.', type: 'creation' },
            { date: '01/11/2024', title: 'Cambio de aseguradora', description: 'Aseguradora cambiada de GNP Seguros a Zurich Seguros al renovar.', type: 'insurer_change' },
            { date: '20/08/2024', title: '+2 vehículos agregados', description: 'Se incorporaron Toyota Hilux (GNX-82-16) y Ford Ranger (CJM-59-40).', type: 'vehicle_add' },
        ],
    },
    {
        id: '4',
        company: 'Distribuidora Noreste SA de CV',
        insurer: 'GNP Seguros',
        insurerInitials: 'GNP',
        insurerColor: 'bg-green-700',
        policyNumber: 'GNP-2025-007812',
        vehicleCount: 12,
        premium: '$71,200',
        status: 'Vigente',
        startDate: '10/01/2025',
        endDate: null,
        legal: {
            curp: 'NORM910812MNLRRB09',
            folioMercantil: 'FME-2018-102347',
            rfc: 'DNO910812TR4',
            legalRepresentative: 'Roberto Noriega Medina',
            fiscalAddress: 'Calle Pino Suárez 830, Col. Obrera, Monterrey, Nuevo León, CP 64010',
            identificationType: 'INE',
            identificationNumber: 'NRMDR91081234M500',
        },
        vehicles: [
            { id: 'v13', brand: 'Ford', model: 'F-150', year: 2023, plates: 'MXK-33-91', vin: '1FTFW1ED0NFC12345', status: 'Activo' },
            { id: 'v14', brand: 'Toyota', model: 'Tacoma', year: 2022, plates: 'BJN-47-58', vin: '3TMCZ5AN3NM123456', status: 'Activo' },
            { id: 'v15', brand: 'Nissan', model: 'NP300 Frontier', year: 2024, plates: 'PQR-12-77', vin: '3N6AD33A0NK123456', status: 'Activo' },
            { id: 'v16', brand: 'Dodge', model: 'Ram 1500', year: 2021, plates: 'TKL-84-20', vin: '1C6SRFKT6MN123456', status: 'Activo' },
            { id: 'v17', brand: 'Chevrolet', model: 'Silverado', year: 2023, plates: 'ZMV-09-63', vin: '1GCRYDED1NZ123456', status: 'Activo' },
        ],
        history: [
            { date: '01/04/2025', title: '+2 vehículos agregados', description: 'Se incorporaron Chevrolet Silverado (ZMV-09-63) y Dodge Ram 1500 (TKL-84-20).', type: 'vehicle_add' },
            { date: '10/01/2025', title: 'Flotilla creada', description: 'Alta de flotilla con 10 unidades de reparto bajo GNP Seguros.', type: 'creation' },
        ],
    },
    {
        id: '5',
        company: 'Construcciones Vega e Hijos SC',
        insurer: 'HDI Seguros',
        insurerInitials: 'HDI',
        insurerColor: 'bg-teal-700',
        policyNumber: 'HDI-2022-004590',
        vehicleCount: 3,
        premium: '$24,800',
        status: 'Por Vencer',
        startDate: '15/07/2022',
        endDate: null,
        group: 'Constructora Vega',
        vehicles: [
            { id: 'v18', brand: 'Ford', model: 'Transit', year: 2020, plates: 'ALG-77-14', vin: '1FTBR1X85LKA12345', status: 'Activo' },
            { id: 'v19', brand: 'Nissan', model: 'Urvan', year: 2021, plates: 'CGM-51-39', vin: 'JN1NANS95U0123456', status: 'Activo' },
            { id: 'v20', brand: 'Mercedes-Benz', model: 'Sprinter 416', year: 2019, plates: 'KPT-68-02', vin: 'WD3PF8CD0KP123456', status: 'Baja' },
        ],
        history: [
            { date: '20/05/2025', title: 'Aviso de vencimiento', description: 'Póliza próxima a vencer el 15/07/2025. Se envió aviso al cliente.', type: 'renewal' },
            { date: '01/03/2025', title: 'Ajuste de prima', description: 'Prima actualizada de $22,500 a $24,800 por inflación de partes.', type: 'premium_adjust' },
            { date: '10/11/2023', title: '1 vehículo dado de baja', description: 'Mercedes-Benz Sprinter (KPT-68-02) dado de baja por antigüedad.', type: 'vehicle_remove' },
            { date: '15/07/2023', title: 'Renovación anual', description: 'Póliza renovada por tercer año. Prima $22,500.', type: 'renewal' },
            { date: '15/07/2022', title: 'Flotilla creada', description: 'Alta inicial con 3 vehículos de servicio bajo HDI Seguros.', type: 'creation' },
        ],
    },
    {
        id: '6',
        company: 'Servicios Médicos Jalisco SA',
        insurer: 'Quálitas',
        insurerInitials: 'QU',
        insurerColor: 'bg-red-700',
        policyNumber: 'QUA-2021-002811',
        vehicleCount: 18,
        premium: '$94,500',
        status: 'Vencida',
        startDate: '05/05/2021',
        endDate: '05/05/2023',
        vehicles: [
            { id: 'v21', brand: 'Toyota', model: 'Corolla', year: 2019, plates: 'RTH-92-45', vin: 'JTDKARFU5K3123456', status: 'Baja' },
            { id: 'v22', brand: 'Volkswagen', model: 'Transporter', year: 2020, plates: 'SBK-14-77', vin: 'WV2ZZZ7HZM3123456', status: 'Activo' },
            { id: 'v23', brand: 'Nissan', model: 'Tsuru', year: 2018, plates: 'LNW-28-03', vin: 'JN1NANS09U0123456', status: 'Baja' },
            { id: 'v24', brand: 'Chevrolet', model: 'Aveo', year: 2021, plates: 'PHX-61-88', vin: 'KL1TF5569MB123456', status: 'Activo' },
        ],
        history: [
            { date: '05/05/2023', title: 'Póliza vencida', description: 'La póliza QUA-2021-002811 venció. Cliente en proceso de transición a otra aseguradora.', type: 'renewal' },
            { date: '01/03/2023', title: '2 vehículos dados de baja', description: 'Toyota Corolla (RTH-92-45) y Nissan Tsuru (LNW-28-03) retirados por obsolescencia.', type: 'vehicle_remove' },
            { date: '05/05/2022', title: 'Renovación anual', description: 'Segunda renovación. Flotilla ajustada a 18 unidades. Prima $94,500.', type: 'renewal' },
            { date: '12/11/2021', title: '+4 vehículos agregados', description: 'Incorporación de 4 unidades Volkswagen Transporter para traslados médicos.', type: 'vehicle_add' },
            { date: '05/05/2021', title: 'Flotilla creada', description: 'Alta con 14 unidades ambulatorias y de traslado bajo Quálitas.', type: 'creation' },
        ],
    },
    {
        id: '7',
        company: 'Agro Exportaciones del Bajío',
        insurer: 'Mapfre',
        insurerInitials: 'MA',
        insurerColor: 'bg-rose-700',
        policyNumber: 'MAP-2024-001388',
        vehicleCount: 6,
        premium: '$41,300',
        status: 'Por Vencer',
        startDate: '20/08/2024',
        endDate: null,
        vehicles: [
            { id: 'v25', brand: 'Ford', model: 'F-350', year: 2022, plates: 'GRL-45-19', vin: '1FT8W3DT0NEA12345', status: 'Activo' },
            { id: 'v26', brand: 'Chevrolet', model: 'Cheyenne', year: 2023, plates: 'WNT-83-57', vin: '3GCPWDED1NG123456', status: 'Activo' },
            { id: 'v27', brand: 'Toyota', model: 'Land Cruiser', year: 2021, plates: 'BCV-16-92', vin: 'JTMCV02J6M4123456', status: 'Activo' },
            { id: 'v28', brand: 'Nissan', model: 'Navara', year: 2020, plates: 'KMR-70-44', vin: 'JN1CZND22Z0123456', status: 'Activo' },
        ],
        history: [
            { date: '10/06/2025', title: 'Aviso de vencimiento', description: 'Póliza vence el 20/08/2025. Cotizaciones de renovación en proceso.', type: 'renewal' },
            { date: '20/02/2025', title: 'Ajuste de prima', description: 'Prima incrementada de $38,000 a $41,300 por actualización de sumas aseguradas.', type: 'premium_adjust' },
            { date: '05/12/2024', title: '+1 vehículo agregado', description: 'Toyota Land Cruiser (BCV-16-92) incorporado a la flotilla.', type: 'vehicle_add' },
            { date: '20/08/2024', title: 'Flotilla creada', description: 'Alta inicial con 3 vehículos campo bajo Mapfre. Cambio desde HDI.', type: 'creation' },
            { date: '20/08/2024', title: 'Cambio de aseguradora', description: 'Aseguradora cambiada de HDI Seguros a Mapfre al renovar vigencia.', type: 'insurer_change' },
        ],
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<FleetStatus, string> = {
    Vigente: 'bg-success/10 text-success border-transparent hover:bg-success/20',
    'Por Vencer': 'bg-warning/10 text-warning border-transparent hover:bg-warning/20',
    Vencida: 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20',
}

const HISTORY_DOT: Record<HistoryEvent['type'], string> = {
    creation: 'bg-primary',
    vehicle_add: 'bg-success',
    vehicle_remove: 'bg-destructive',
    insurer_change: 'bg-warning',
    renewal: 'bg-blue-500',
    premium_adjust: 'bg-violet-500',
}

function todayDDMMYYYY(): string {
    const now = new Date()
    const d = String(now.getDate()).padStart(2, '0')
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const y = now.getFullYear()
    return `${d}/${m}/${y}`
}

function parseDDMMYYYY(dateStr: string): Date {
    const [d, m, y] = dateStr.split('/').map(Number)
    return new Date(y, m - 1, d)
}

function computeDaysActive(startDate: string, endDate: string | null): number {
    const start = parseDDMMYYYY(startDate)
    const end = endDate ? parseDDMMYYYY(endDate) : new Date()
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

function formatPremium(raw: string): string {
    const num = Number(raw.replace(/[^0-9.]/g, ''))
    if (isNaN(num) || raw.trim() === '') return raw
    return `$${num.toLocaleString('es-MX')}`
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FleetStatus }) {
    return (
        <Badge variant="outline" className={cn('font-medium text-xs', STATUS_STYLES[status])}>
            {status}
        </Badge>
    )
}

// ─── Vehicle Status Badge ─────────────────────────────────────────────────────

function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium text-xs',
                status === 'Activo' && 'bg-success/10 text-success border-success/20',
                status === 'Baja' && 'bg-destructive/10 text-destructive border-transparent'
            )}
        >
            {status}
        </Badge>
    )
}

// ─── ID Location Modal ────────────────────────────────────────────────────────

function IdLocationModal({
    identificationType,
    onClose,
}: {
    identificationType: 'INE' | 'Pasaporte'
    onClose: () => void
}) {
    const text =
        identificationType === 'INE'
            ? 'El número de identificación (OCR) se encuentra en la parte inferior de la cara frontal de tu INE, debajo de la fotografía. Son 13 dígitos en formato numérico.'
            : 'El número de pasaporte se encuentra en la parte superior derecha de la página de datos biográficos, también aparece en la zona de lectura mecánica (MRZ) al final de la página.'

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="font-semibold text-primary text-sm">
                        Ubicación del número de {identificationType}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300">
                        <IdCard className="w-14 h-14 text-slate-400" />
                        <p className="text-xs text-slate-400 font-medium">
                            Vista ilustrativa — {identificationType}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full"
                    >
                        Entendido
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─── Legal Documentation Card ─────────────────────────────────────────────────

function FileDocCard({
    label,
    filename,
    hint,
}: {
    label: string
    filename?: string
    hint?: string
}) {
    if (filename) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{label}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{filename}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs h-8">
                        <FileText className="h-3 w-3" />
                        Ver documento
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 gap-1.5 text-xs h-8 text-muted-foreground">
                        <Upload className="h-3 w-3" />
                        Reemplazar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[110px]">
            <Upload className="h-6 w-6 text-slate-400" />
            <p className="text-xs font-medium text-muted-foreground">
                Subir {label}
            </p>
            {hint && (
                <p className="text-[10px] text-slate-400">{hint}</p>
            )}
        </div>
    )
}

function LegalDocumentationCard({ legal }: { legal?: LegalData }) {
    const [showIdModal, setShowIdModal] = useState(false)

    if (!legal) {
        return (
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Documentación legal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                            <FileQuestion className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Sin documentación legal registrada</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Aún no se han cargado datos fiscales ni documentos para esta flotilla.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-1"
                            onClick={() => alert('Funcionalidad en desarrollo')}
                        >
                            Agregar documentación
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const hasAnyFiscal = legal.curp || legal.folioMercantil || legal.rfc || legal.legalRepresentative || legal.fiscalAddress
    const hasIdData = legal.identificationType || legal.identificationNumber

    return (
        <>
            {showIdModal && legal.identificationType && (
                <IdLocationModal
                    identificationType={legal.identificationType}
                    onClose={() => setShowIdModal(false)}
                />
            )}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Documentación legal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Section A — Datos fiscales */}
                    {hasAnyFiscal && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Datos fiscales
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {legal.curp && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">CURP</p>
                                        <p className="text-sm font-mono font-semibold text-foreground">{legal.curp}</p>
                                    </div>
                                )}
                                {legal.folioMercantil && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Folio Mercantil</p>
                                        <p className="text-sm font-mono font-semibold text-foreground">{legal.folioMercantil}</p>
                                    </div>
                                )}
                                {legal.rfc && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">RFC</p>
                                        <p className="text-sm font-mono font-semibold text-foreground">{legal.rfc}</p>
                                    </div>
                                )}
                                {legal.legalRepresentative && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Representante Legal</p>
                                        <p className="text-sm font-semibold text-foreground">{legal.legalRepresentative}</p>
                                    </div>
                                )}
                                {legal.fiscalAddress && (
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Domicilio Fiscal</p>
                                        <p className="text-sm text-foreground">{legal.fiscalAddress}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section B — Identificación */}
                    {hasIdData && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Identificación
                            </p>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                {legal.identificationType && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                                            Tipo de identificación
                                        </p>
                                        <Badge
                                            className={cn(
                                                'text-xs font-semibold',
                                                legal.identificationType === 'INE'
                                                    ? 'bg-primary text-white hover:bg-primary/90'
                                                    : 'bg-accent text-white hover:bg-accent/90'
                                            )}
                                        >
                                            {legal.identificationType}
                                        </Badge>
                                    </div>
                                )}
                                {legal.identificationNumber && (
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                                            No. de identificación
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-mono font-semibold text-foreground">
                                                {legal.identificationNumber}
                                            </p>
                                            {legal.identificationType && (
                                                <button
                                                    onClick={() => setShowIdModal(true)}
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-md px-2 py-0.5 bg-primary/5 hover:bg-primary/10"
                                                    aria-label="Ver ubicación en documento"
                                                >
                                                    <IdCard className="h-3 w-3" />
                                                    Ver ubicación
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section C — Documentos */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Documentos
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <FileDocCard
                                label="Acta constitutiva"
                                filename={legal.actaConstitutiva}
                            />
                            <FileDocCard
                                label="Poderes"
                                filename={legal.poderes}
                            />
                            <FileDocCard
                                label="Constancia de situación fiscal"
                                filename={legal.constanciaFiscal}
                                hint="Formato PDF"
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </>
    )
}

// ─── New Fleet Modal ──────────────────────────────────────────────────────────

interface NewFleetForm {
    company: string
    insurer: string
    policyNumber: string
    premium: string
    startDate: string
    group: string
    // legal
    curp: string
    folioMercantil: string
    rfc: string
    legalRepresentative: string
    fiscalAddress: string
    identificationType: 'INE' | 'Pasaporte'
    identificationNumber: string
    actaConstitutiva: string
    poderes: string
    constanciaFiscal: string
}

const EMPTY_FORM: NewFleetForm = {
    company: '',
    insurer: '',
    policyNumber: '',
    premium: '',
    startDate: todayDDMMYYYY(),
    group: '',
    curp: '',
    folioMercantil: '',
    rfc: '',
    legalRepresentative: '',
    fiscalAddress: '',
    identificationType: 'INE',
    identificationNumber: '',
    actaConstitutiva: '',
    poderes: '',
    constanciaFiscal: '',
}

function ModalFileCard({
    label,
    filename,
    onSelect,
    onClear,
    inputRef,
}: {
    label: string
    filename: string
    onSelect: (name: string) => void
    onClear: () => void
    inputRef: React.RefObject<HTMLInputElement | null>
}) {
    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="sr-only"
                aria-label={`Subir ${label}`}
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onSelect(file.name)
                    // reset so same file can be re-selected if cleared
                    e.target.value = ''
                }}
            />
            {filename ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-foreground">{label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{filename}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClear}
                        className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                        aria-label={`Quitar ${label}`}
                    >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors p-3 flex flex-col items-center justify-center gap-1.5 text-center min-h-[80px]"
                >
                    <Upload className="h-5 w-5 text-slate-400" />
                    <p className="text-[11px] font-medium text-muted-foreground">Subir {label}</p>
                    <p className="text-[10px] text-slate-400">PDF</p>
                </button>
            )}
        </div>
    )
}

function NewFleetModal({
    onClose,
    onSave,
}: {
    onClose: () => void
    onSave: (fleet: Fleet) => void
}) {
    const [form, setForm] = useState<NewFleetForm>(EMPTY_FORM)

    const actaRef = useRef<HTMLInputElement>(null)
    const poderesRef = useRef<HTMLInputElement>(null)
    const constanciaRef = useRef<HTMLInputElement>(null)

    const selectedInsurer = INSURERS.find((i) => i.name === form.insurer)

    const isValid =
        form.company.trim().length >= 3 &&
        form.insurer !== '' &&
        form.policyNumber.trim().length >= 3 &&
        form.premium.trim() !== '' &&
        form.startDate.trim() !== ''

    function set<K extends keyof NewFleetForm>(key: K, value: NewFleetForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function handleSave() {
        if (!isValid || !selectedInsurer) return

        const hasIdData = form.identificationNumber.trim() !== ''
        const legalFields: LegalData = {
            curp: form.curp.trim() || undefined,
            folioMercantil: form.folioMercantil.trim() || undefined,
            rfc: form.rfc.trim() || undefined,
            legalRepresentative: form.legalRepresentative.trim() || undefined,
            fiscalAddress: form.fiscalAddress.trim() || undefined,
            identificationType: hasIdData ? form.identificationType : undefined,
            identificationNumber: form.identificationNumber.trim() || undefined,
            actaConstitutiva: form.actaConstitutiva || undefined,
            poderes: form.poderes || undefined,
            constanciaFiscal: form.constanciaFiscal || undefined,
        }

        const hasAnyLegal = Object.values(legalFields).some((v) => v !== undefined)

        const today = todayDDMMYYYY()

        const newFleet: Fleet = {
            id: String(Date.now()),
            company: form.company.trim(),
            insurer: selectedInsurer.name,
            insurerInitials: selectedInsurer.initials,
            insurerColor: selectedInsurer.color,
            policyNumber: form.policyNumber.trim(),
            vehicleCount: 0,
            premium: formatPremium(form.premium.trim()),
            status: 'Vigente',
            startDate: form.startDate.trim(),
            endDate: null,
            vehicles: [],
            history: [
                {
                    date: today,
                    title: 'Flotilla creada',
                    description: `Se registró la flotilla con ${form.company.trim()}`,
                    type: 'creation',
                },
            ],
            group: form.group.trim() || undefined,
            legal: hasAnyLegal ? legalFields : undefined,
        }

        onSave(newFleet)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-start justify-between gap-4 shrink-0">
                    <div>
                        <h2 className="text-white font-bold text-lg leading-tight">Nueva Flotilla</h2>
                        <p className="text-white/70 text-sm mt-0.5">
                            Completa los datos para registrar la flotilla
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors mt-0.5 shrink-0"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-[80vh] flex-1">

                    {/* Section 1: Datos de la flotilla */}
                    <div className="px-6 pt-5 pb-1">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                            <Truck className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Datos de la flotilla</h3>
                        </div>
                    </div>

                    <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Nombre de empresa */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                Nombre de la empresa / cliente <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Ej. Transportes Rápidos SA de CV"
                                value={form.company}
                                onChange={(e) => set('company', e.target.value)}
                                className="h-9"
                            />
                        </div>

                        {/* Aseguradora */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                Aseguradora <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={form.insurer}
                                onChange={(e) => set('insurer', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Selecciona una aseguradora</option>
                                {INSURERS.map((ins) => (
                                    <option key={ins.name} value={ins.name}>
                                        {ins.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* No. Póliza */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                No. Póliza <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Ej. AXA-2025-001234"
                                value={form.policyNumber}
                                onChange={(e) => set('policyNumber', e.target.value)}
                                className="h-9 font-mono"
                            />
                        </div>

                        {/* Prima anual */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                Prima anual <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Ej. 48000"
                                value={form.premium}
                                onChange={(e) => set('premium', e.target.value)}
                                className="h-9"
                                type="text"
                                inputMode="numeric"
                            />
                        </div>

                        {/* Fecha de alta */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                Fecha de alta <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="DD/MM/AAAA"
                                value={form.startDate}
                                onChange={(e) => set('startDate', e.target.value)}
                                className="h-9 font-mono"
                            />
                        </div>

                        {/* Grupo */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                                Grupo <span className="text-muted-foreground font-normal normal-case">(opcional)</span>
                            </label>
                            <select
                                value={form.group}
                                onChange={(e) => set('group', e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="">Sin grupo</option>
                                {GROUPS.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Section 2: Documentación legal */}
                    <div className="px-6 pt-1 pb-1">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Documentación legal</h3>
                            <span className="text-xs text-muted-foreground">(opcional pero recomendado)</span>
                        </div>
                    </div>

                    <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* CURP */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">CURP</label>
                            <Input
                                placeholder="Ej. ABCD850101HDFXXX00"
                                value={form.curp}
                                onChange={(e) => set('curp', e.target.value.toUpperCase())}
                                className="h-9 font-mono"
                                maxLength={18}
                            />
                        </div>

                        {/* Folio Mercantil */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Folio Mercantil</label>
                            <Input
                                placeholder="Ej. FME-2020-001234"
                                value={form.folioMercantil}
                                onChange={(e) => set('folioMercantil', e.target.value)}
                                className="h-9 font-mono"
                            />
                        </div>

                        {/* RFC */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">RFC</label>
                            <Input
                                placeholder="Ej. ABC850101XY1"
                                value={form.rfc}
                                onChange={(e) => set('rfc', e.target.value.toUpperCase())}
                                className="h-9 font-mono"
                                maxLength={13}
                            />
                        </div>

                        {/* Representante Legal */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Representante Legal</label>
                            <Input
                                placeholder="Nombre completo"
                                value={form.legalRepresentative}
                                onChange={(e) => set('legalRepresentative', e.target.value)}
                                className="h-9"
                            />
                        </div>

                        {/* Domicilio Fiscal */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Domicilio Fiscal</label>
                            <textarea
                                placeholder="Calle, número, colonia, ciudad, estado, CP"
                                value={form.fiscalAddress}
                                onChange={(e) => set('fiscalAddress', e.target.value)}
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring resize-none placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Tipo de identificación */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Tipo de identificación</label>
                            <div className="flex gap-2">
                                {(['INE', 'Pasaporte'] as const).map((tipo) => (
                                    <button
                                        key={tipo}
                                        type="button"
                                        onClick={() => set('identificationType', tipo)}
                                        className={cn(
                                            'flex-1 py-2 rounded-lg border text-sm font-medium transition-all',
                                            form.identificationType === tipo
                                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                                : 'border-slate-200 bg-white text-muted-foreground hover:border-slate-300'
                                        )}
                                    >
                                        {tipo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* No. de identificación */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">No. de identificación</label>
                            <Input
                                placeholder={form.identificationType === 'INE' ? 'OCR — 13 dígitos' : 'No. de pasaporte'}
                                value={form.identificationNumber}
                                onChange={(e) => set('identificationNumber', e.target.value)}
                                className="h-9 font-mono"
                            />
                        </div>

                        {/* File uploaders */}
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                            <ModalFileCard
                                label="Acta constitutiva"
                                filename={form.actaConstitutiva}
                                onSelect={(name) => set('actaConstitutiva', name)}
                                onClear={() => set('actaConstitutiva', '')}
                                inputRef={actaRef}
                            />
                            <ModalFileCard
                                label="Poderes"
                                filename={form.poderes}
                                onSelect={(name) => set('poderes', name)}
                                onClear={() => set('poderes', '')}
                                inputRef={poderesRef}
                            />
                            <ModalFileCard
                                label="Constancia fiscal"
                                filename={form.constanciaFiscal}
                                onSelect={(name) => set('constanciaFiscal', name)}
                                onClear={() => set('constanciaFiscal', '')}
                                inputRef={constanciaRef}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isValid}
                        className="bg-primary hover:bg-primary/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Truck className="h-4 w-4" />
                        Guardar Flotilla
                    </Button>
                </div>

            </div>
        </div>
    )
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function FleetDetailView({ fleet, onBack }: { fleet: Fleet; onBack: () => void }) {
    const daysActive = computeDaysActive(fleet.startDate, fleet.endDate)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back + header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onBack}
                    className="gap-2 shrink-0 self-start"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Flotillas
                </Button>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div
                            className={cn(
                                'h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0',
                                fleet.insurerColor
                            )}
                        >
                            {fleet.insurerInitials}
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">{fleet.company}</h1>
                        <StatusBadge status={fleet.status} />
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{fleet.policyNumber}</p>
                </div>
            </div>

            {/* Información importante */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Información importante</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Fecha de alta
                            </p>
                            <p className="text-sm font-semibold text-foreground">{fleet.startDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Fecha de baja
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {fleet.endDate ? fleet.endDate : <span className="text-success">Activa</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Días activa
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {daysActive.toLocaleString('es-MX')} días
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Prima anual
                            </p>
                            <p className="text-sm font-semibold text-foreground">{fleet.premium}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5 flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                Aseguradora responsable
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div
                                    className={cn(
                                        'h-5 w-5 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0',
                                        fleet.insurerColor
                                    )}
                                >
                                    {fleet.insurerInitials}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{fleet.insurer}</p>
                            </div>
                        </div>
                        {fleet.group && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                                    Grupo
                                </p>
                                <p className="text-sm font-semibold text-foreground">{fleet.group}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Documentación legal */}
            <LegalDocumentationCard legal={fleet.legal} />

            {/* Vehículos */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Vehículos</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {fleet.vehicles.filter(v => v.status === 'Activo').length} activos
                                {' · '}
                                {fleet.vehicles.filter(v => v.status === 'Baja').length} de baja
                            </p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            Agregar Vehículo
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="pl-4 text-xs">Marca / Modelo</TableHead>
                                    <TableHead className="text-xs">Año</TableHead>
                                    <TableHead className="text-xs">Placas</TableHead>
                                    <TableHead className="text-xs">No. Serie (VIN)</TableHead>
                                    <TableHead className="text-xs">Estatus</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fleet.vehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                                            Sin vehículos registrados aún.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    fleet.vehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id} className="hover:bg-slate-50/50">
                                            <TableCell className="pl-4 font-medium text-sm">
                                                {vehicle.brand}{' '}
                                                <span className="text-muted-foreground font-normal">
                                                    {vehicle.model}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm">{vehicle.year}</TableCell>
                                            <TableCell className="font-mono text-sm font-semibold">
                                                {vehicle.plates}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {vehicle.vin}
                                            </TableCell>
                                            <TableCell>
                                                <VehicleStatusBadge status={vehicle.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Histórico de la flotilla</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Eventos más recientes al inicio.
                    </p>
                </CardHeader>
                <CardContent>
                    <ol className="relative border-l border-border ml-3 space-y-5">
                        {fleet.history.map((event, i) => (
                            <li key={i} className="pl-6">
                                <span
                                    className={cn(
                                        'absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-background',
                                        HISTORY_DOT[event.type]
                                    )}
                                />
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-foreground">
                                            {event.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                            {event.date}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {event.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FleetsPage() {
    const [fleets, setFleets] = useState<Fleet[]>(INITIAL_FLEETS)
    const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'Todas' | FleetStatus>('Todas')
    const [showNewFleet, setShowNewFleet] = useState(false)

    function handleAddFleet(fleet: Fleet) {
        setFleets((prev) => [fleet, ...prev])
    }

    const filtered = fleets.filter((fleet) => {
        const term = search.toLowerCase().trim()
        const matchesSearch =
            !term ||
            fleet.company.toLowerCase().includes(term) ||
            fleet.policyNumber.toLowerCase().includes(term) ||
            fleet.insurer.toLowerCase().includes(term)
        const matchesStatus = statusFilter === 'Todas' || fleet.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Detail view
    if (selectedFleet) {
        return (
            <FleetDetailView
                fleet={selectedFleet}
                onBack={() => setSelectedFleet(null)}
            />
        )
    }

    const totalVehicles = fleets.reduce((s, f) => s + f.vehicleCount, 0)
    const vigentes = fleets.filter(f => f.status === 'Vigente').length
    const vencidas = fleets.filter(f => f.status === 'Vencida').length

    const STATUS_FILTERS: Array<'Todas' | FleetStatus> = ['Todas', 'Vigente', 'Por Vencer', 'Vencida']

    return (
        <>
            {showNewFleet && (
                <NewFleetModal
                    onClose={() => setShowNewFleet(false)}
                    onSave={handleAddFleet}
                />
            )}

            <div className="space-y-8 animate-fade-in">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Flotillas</h1>
                        <p className="text-muted-foreground mt-2">
                            Administra pólizas de flotilla y sus vehículos asociados.
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 shrink-0 gap-2 self-start sm:self-auto"
                        onClick={() => setShowNewFleet(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Flotilla
                    </Button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Flotillas totales', value: fleets.length },
                        { label: 'Vehículos totales', value: totalVehicles },
                        { label: 'Vigentes', value: vigentes },
                        { label: 'Vencidas', value: vencidas },
                    ].map((stat) => (
                        <Card key={stat.label} className="text-center py-1">
                            <CardContent className="pt-4 pb-3">
                                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table card */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Flotillas registradas</CardTitle>
                                <span className="text-sm text-muted-foreground font-normal">
                                    {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Buscar empresa, póliza o aseguradora..."
                                        className="pl-8 bg-white h-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-1">
                                    {STATUS_FILTERS.map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setStatusFilter(f)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                                statusFilter === f
                                                    ? 'bg-primary text-white'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                            )}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="rounded-b-md border-t overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-4 text-xs w-40">No. Póliza</TableHead>
                                        <TableHead className="text-xs">Empresa / Cliente</TableHead>
                                        <TableHead className="text-xs">Aseguradora</TableHead>
                                        <TableHead className="text-xs text-center">Vehículos</TableHead>
                                        <TableHead className="text-xs">Prima anual</TableHead>
                                        <TableHead className="text-xs">Alta</TableHead>
                                        <TableHead className="text-xs">Baja</TableHead>
                                        <TableHead className="text-xs">Estatus</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                No se encontraron flotillas con ese criterio.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((fleet) => (
                                        <TableRow
                                            key={fleet.id}
                                            className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedFleet(fleet)}
                                        >
                                            <TableCell className="pl-4 font-mono text-xs font-semibold text-muted-foreground">
                                                {fleet.policyNumber}
                                            </TableCell>
                                            <TableCell className="font-medium text-sm text-primary">
                                                {fleet.company}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={cn(
                                                            'h-6 w-6 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0',
                                                            fleet.insurerColor
                                                        )}
                                                        aria-label={fleet.insurer}
                                                    >
                                                        {fleet.insurerInitials}
                                                    </div>
                                                    <span className="text-sm">{fleet.insurer}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold w-7 h-7">
                                                    {fleet.vehicleCount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {fleet.premium}
                                            </TableCell>
                                            <TableCell className="text-sm tabular-nums text-muted-foreground">
                                                {fleet.startDate}
                                            </TableCell>
                                            <TableCell className="text-sm tabular-nums text-muted-foreground">
                                                {fleet.endDate ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={fleet.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
