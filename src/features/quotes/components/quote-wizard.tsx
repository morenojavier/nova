'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Car, CheckCircle2, X, Star, CreditCard, Lock, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InsurerLogo } from '@/components/ui/insurer-logo'
import { cn } from '@/lib/utils'
import {
    getBrands, getModelsByBrand, getYearsForBrand, getVersions, vehicleUsageOptions,
    type VehicleModel, type VehicleVersion,
} from '../data/vehicles'

/* ─── Types ─── */

type DriverData = {
    sex: string
    birthDate: string
    zipCode: string
    name: string
    email: string
    phone: string
    whatsapp: string
    whatsappSameAsPhone: boolean
}

type FullDriverData = DriverData & {
    firstName: string
    paternalLastName: string
    maternalLastName: string
    birthState: string
}

type QuoteData = {
    year: string
    model: VehicleModel | null
    version: VehicleVersion | null
    usage: string
    isInsured: boolean | null
    driver: DriverData
    otherDriver: DriverData & { relationship: string }
    selectedInsurer: string | null
    confirmedDriver: FullDriverData
}

const emptyDriver: DriverData = { sex: '', birthDate: '', zipCode: '', name: '', email: '', phone: '', whatsapp: '', whatsappSameAsPhone: true }
const emptyFullDriver: FullDriverData = { ...emptyDriver, firstName: '', paternalLastName: '', maternalLastName: '', birthState: '' }

const relationshipOptions = [
    'Cónyuge', 'Hijo(a)', 'Padre/Madre', 'Hermano(a)', 'Familiar', 'Empleado', 'Otro',
]

const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
    'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
    'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
    'Yucatán', 'Zacatecas',
]

type PlanPricing = {
    annualPremium: number
    coverages: number
    assists: number
}

type InsuranceQuote = {
    id: string
    insurer: string
    initials: string
    color: string
    msiMonths: number
    recommended: boolean
    plans: Record<'amplio' | 'limitado' | 'basico', PlanPricing>
}

const planLabels: Record<string, string> = {
    amplio: 'Plan Amplio',
    limitado: 'Plan Limitado',
    basico: 'Plan Básico',
}

type PaymentType = 'annual' | 'semester' | 'quarterly' | 'monthly'
const paymentOptions: { val: PaymentType; label: string; divisor: number }[] = [
    { val: 'annual', label: 'Anual', divisor: 1 },
    { val: 'semester', label: 'Semestral', divisor: 2 },
    { val: 'quarterly', label: 'Trimestral', divisor: 4 },
    { val: 'monthly', label: 'Mensual', divisor: 12 },
]

const mockQuotes: InsuranceQuote[] = [
    {
        id: 'chubb-1', insurer: 'CHUBB', initials: 'CH', color: '#002855', msiMonths: 6, recommended: true,
        plans: {
            amplio: { annualPremium: 11622, coverages: 7, assists: 10 },
            limitado: { annualPremium: 8450, coverages: 5, assists: 7 },
            basico: { annualPremium: 5980, coverages: 3, assists: 4 },
        },
    },
    {
        id: 'hdi-1', insurer: 'HDI', initials: 'HDI', color: '#006341', msiMonths: 12, recommended: false,
        plans: {
            amplio: { annualPremium: 17919, coverages: 7, assists: 9 },
            limitado: { annualPremium: 12100, coverages: 5, assists: 6 },
            basico: { annualPremium: 7350, coverages: 3, assists: 4 },
        },
    },
    {
        id: 'qualitas-1', insurer: 'Quálitas', initials: 'Q', color: '#6A0DAD', msiMonths: 6, recommended: false,
        plans: {
            amplio: { annualPremium: 9850, coverages: 6, assists: 8 },
            limitado: { annualPremium: 7200, coverages: 4, assists: 5 },
            basico: { annualPremium: 4900, coverages: 3, assists: 3 },
        },
    },
    {
        id: 'mapfre-1', insurer: 'Mapfre', initials: 'M', color: '#E30613', msiMonths: 12, recommended: false,
        plans: {
            amplio: { annualPremium: 13400, coverages: 8, assists: 12 },
            limitado: { annualPremium: 9800, coverages: 5, assists: 8 },
            basico: { annualPremium: 6200, coverages: 3, assists: 5 },
        },
    },
    {
        id: 'zurich-1', insurer: 'Zurich', initials: 'Z', color: '#003399', msiMonths: 12, recommended: false,
        plans: {
            amplio: { annualPremium: 14200, coverages: 7, assists: 10 },
            limitado: { annualPremium: 10500, coverages: 5, assists: 7 },
            basico: { annualPremium: 6800, coverages: 3, assists: 4 },
        },
    },
    {
        id: 'axa-1', insurer: 'AXA', initials: 'AXA', color: '#00008F', msiMonths: 12, recommended: false,
        plans: {
            amplio: { annualPremium: 15300, coverages: 9, assists: 11 },
            limitado: { annualPremium: 11200, coverages: 6, assists: 8 },
            basico: { annualPremium: 7100, coverages: 4, assists: 5 },
        },
    },
    {
        id: 'gnp-1', insurer: 'GNP Seguros', initials: 'GNP', color: '#FF6D00', msiMonths: 12, recommended: false,
        plans: {
            amplio: { annualPremium: 10200, coverages: 8, assists: 11 },
            limitado: { annualPremium: 7800, coverages: 5, assists: 7 },
            basico: { annualPremium: 5450, coverages: 3, assists: 4 },
        },
    },
]

const TOTAL_STEPS = 4

const anim = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.25 },
}

/* ─── Main Wizard ─── */

export function QuoteWizard() {
    const [step, setStep] = useState(1)
    const [data, setData] = useState<QuoteData>({
        year: '',
        model: null,
        version: null,
        usage: '',
        isInsured: null,
        driver: { ...emptyDriver },
        otherDriver: { ...emptyDriver, relationship: '' },
        selectedInsurer: null,
        confirmedDriver: { ...emptyFullDriver },
    })

    const progressPercent = Math.min(((step - 1) / TOTAL_STEPS) * 100, 100)

    function goBack() {
        setStep(s => Math.max(s - 1, 1))
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress */}
            {step <= TOTAL_STEPS && (
                <div className="mb-8">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Paso {step} de {TOTAL_STEPS}</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {step > 1 && step <= TOTAL_STEPS && (
                <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </button>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <StepVehicle
                        key="step-vehicle"
                        data={data}
                        onChange={(partial) => setData(d => ({ ...d, ...partial }))}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <StepDriverInfo
                        key="step-driver"
                        data={data}
                        onChange={(partial) => setData(d => ({ ...d, ...partial }))}
                        onSubmit={() => setStep(3)}
                    />
                )}
                {step === 3 && (
                    <StepInsurers
                        key="step-insurers"
                        data={data}
                        onChange={(partial) => setData(d => ({ ...d, ...partial }))}
                        onNext={() => {
                            // Pre-fill confirmed driver from step 2 data
                            const nameParts = data.driver.name.trim().split(/\s+/)
                            setData(d => ({
                                ...d,
                                confirmedDriver: {
                                    ...d.driver,
                                    firstName: nameParts[0] || '',
                                    paternalLastName: nameParts[1] || '',
                                    maternalLastName: nameParts.slice(2).join(' ') || '',
                                    birthState: '',
                                },
                            }))
                            setStep(4)
                        }}
                    />
                )}
                {step === 4 && (
                    <StepConfirmDriver
                        key="step-confirm"
                        data={data}
                        onChange={(partial) => setData(d => ({ ...d, ...partial }))}
                        onSubmit={() => setStep(5)}
                    />
                )}
                {step === 5 && (
                    <StepDone key="step-done" data={data} />
                )}
            </AnimatePresence>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PASO 1: Selección de vehículo (año → modelo → versión)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StepVehicle({
    data,
    onChange,
    onNext,
}: {
    data: QuoteData
    onChange: (partial: Partial<QuoteData>) => void
    onNext: () => void
}) {
    const [selectedBrand, setSelectedBrand] = useState(data.model?.brand ?? '')

    const brands = useMemo(() => getBrands(), [])
    const availableYears = useMemo(
        () => selectedBrand ? getYearsForBrand(selectedBrand) : [],
        [selectedBrand]
    )
    const models = useMemo(
        () => (selectedBrand && data.year) ? getModelsByBrand(selectedBrand, data.year) : [],
        [selectedBrand, data.year]
    )
    const versions = useMemo(
        () => data.model ? getVersions(data.model.id, data.year) : [],
        [data.model, data.year]
    )

    function selectBrand(brand: string) {
        setSelectedBrand(brand)
        onChange({ year: '', model: null, version: null })
    }

    function selectYear(year: string) {
        onChange({ year, model: null, version: null })
    }

    function selectModel(m: VehicleModel) {
        const v = getVersions(m.id, data.year)
        onChange({ model: m, version: v.length === 1 ? v[0] : null })
    }

    const canContinue = data.year !== '' && data.model !== null && data.version !== null

    const selectClass = 'flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

    return (
        <motion.div {...anim} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-primary">Datos del vehículo</h2>
                <p className="text-muted-foreground mt-1">Selecciona marca, año, modelo y versión</p>
            </div>

            {/* ── Marca ── */}
            <div className="space-y-2">
                <Label>Marca</Label>
                <select
                    value={selectedBrand}
                    onChange={(e) => selectBrand(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Selecciona una marca</option>
                    {brands.map(b => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            {/* ── Año ── */}
            {selectedBrand && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                    <Label>Año</Label>
                    <select
                        value={data.year}
                        onChange={(e) => selectYear(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Selecciona el año</option>
                        {availableYears.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </motion.div>
            )}

            {/* ── Modelo ── */}
            {selectedBrand && data.year && models.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                    <Label>Modelo</Label>
                    {models.length === 1 ? (
                        // Auto-select if only one model
                        (() => {
                            if (!data.model) selectModel(models[0])
                            return (
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                                    <Car className="w-5 h-5 text-primary shrink-0" />
                                    <p className="font-semibold text-primary text-sm">{models[0].brand} {models[0].name}</p>
                                </div>
                            )
                        })()
                    ) : (
                        <div className="space-y-1.5">
                            {models.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => selectModel(m)}
                                    className={cn(
                                        'flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all',
                                        data.model?.id === m.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50'
                                    )}
                                >
                                    <Car className="w-5 h-5 text-primary shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-primary text-sm">{m.brand} {m.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(m.versions[data.year]?.length ?? 0)} versiones
                                        </p>
                                    </div>
                                    {data.model?.id === m.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── Versión ── */}
            {data.model && versions.length > 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                    <Label>Versión — {data.model.brand} {data.model.name} {data.year}</Label>
                    <div className="space-y-1.5">
                        {versions.map(v => (
                            <button
                                key={v.id}
                                onClick={() => onChange({ version: v })}
                                className={cn(
                                    'flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all',
                                    data.version?.id === v.id
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50'
                                )}
                            >
                                <div>
                                    <p className="font-semibold text-sm text-primary">{v.name}</p>
                                    <p className="text-xs text-muted-foreground">{v.transmission} · {v.engine}</p>
                                </div>
                                {data.version?.id === v.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {data.model && versions.length === 1 && data.version && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-xl border border-success/30 bg-success/5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="text-primary">
                        Versión: <span className="font-semibold">{data.version.name}</span> — {data.version.transmission} · {data.version.engine}
                    </span>
                </motion.div>
            )}

            <Button onClick={onNext} disabled={!canContinue} className="w-full h-12 text-base">
                Continuar
            </Button>
        </motion.div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PASO 2: Datos del conductor + uso del vehículo
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StepDriverInfo({
    data,
    onChange,
    onSubmit,
}: {
    data: QuoteData
    onChange: (partial: Partial<QuoteData>) => void
    onSubmit: () => void
}) {
    function updateDriver<K extends keyof DriverData>(field: K, value: DriverData[K]) {
        onChange({ driver: { ...data.driver, [field]: value } })
    }

    function updateOtherDriver<K extends keyof (DriverData & { relationship: string })>(
        field: K,
        value: (DriverData & { relationship: string })[K]
    ) {
        onChange({ otherDriver: { ...data.otherDriver, [field]: value } })
    }

    const driverValid =
        data.driver.sex !== '' &&
        data.driver.birthDate !== '' &&
        data.driver.zipCode.length >= 4 &&
        data.driver.name.trim().length >= 2 &&
        data.driver.email.includes('@') &&
        data.driver.phone.length >= 10

    const otherDriverValid = data.isInsured !== false || (
        data.otherDriver.relationship !== '' &&
        data.otherDriver.sex !== '' &&
        data.otherDriver.birthDate !== '' &&
        data.otherDriver.name.trim().length >= 2
    )

    const isValid = data.usage !== '' && data.isInsured !== null && driverValid && otherDriverValid

    return (
        <motion.div {...anim} className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-primary">Datos del conductor</h2>
                <p className="text-muted-foreground mt-1">
                    Cotización para: {data.model?.brand} {data.model?.name} {data.version?.name} {data.year}
                </p>
            </div>

            {/* Uso del vehículo */}
            <div className="space-y-3">
                <Label>Motivo de uso del vehículo</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicleUsageOptions.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => onChange({ usage: opt.id })}
                            className={cn(
                                'p-3 rounded-xl border text-left text-sm font-medium transition-all',
                                data.usage === opt.id
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50 text-muted-foreground'
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ¿Es el conductor? */}
            <div className="space-y-3">
                <Label>¿El contratante es el conductor a asegurar?</Label>
                <div className="flex gap-3">
                    {[{ val: true, label: 'Sí' }, { val: false, label: 'No, es otra persona' }].map(opt => (
                        <button
                            key={String(opt.val)}
                            onClick={() => onChange({ isInsured: opt.val })}
                            className={cn(
                                'flex-1 py-3 rounded-xl border text-sm font-semibold transition-all',
                                data.isInsured === opt.val
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Datos del contratante */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Datos del contratante</h3>
                <div className="space-y-2">
                    <Label>Sexo</Label>
                    <div className="flex gap-3">
                        {[{ val: 'male', label: 'Masculino' }, { val: 'female', label: 'Femenino' }].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => updateDriver('sex', opt.val)}
                                className={cn(
                                    'flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                                    data.driver.sex === opt.val
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="birthDate" type="date" label="Fecha de nacimiento" value={data.driver.birthDate} onChange={(e) => updateDriver('birthDate', e.target.value)} className="h-11" />
                    <Input id="zipCode" type="text" inputMode="numeric" maxLength={5} label="Código postal" placeholder="Ej. 06600" value={data.driver.zipCode} onChange={(e) => updateDriver('zipCode', e.target.value.replace(/\D/g, ''))} className="h-11" />
                </div>
                <Input id="driverName" label="Nombre completo" placeholder="Nombre y apellidos" value={data.driver.name} onChange={(e) => updateDriver('name', e.target.value)} className="h-11" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="driverEmail" type="email" label="Correo electrónico" placeholder="correo@ejemplo.com" value={data.driver.email} onChange={(e) => updateDriver('email', e.target.value)} className="h-11" />
                    <Input id="driverPhone" type="tel" inputMode="numeric" maxLength={10} label="Celular" placeholder="10 dígitos" value={data.driver.phone} onChange={(e) => updateDriver('phone', e.target.value.replace(/\D/g, ''))} className="h-11" />
                </div>
            </div>

            {/* Otro conductor */}
            <AnimatePresence>
                {data.isInsured === false && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                        <h3 className="text-lg font-semibold text-primary border-b pb-2">Datos del conductor a asegurar</h3>
                        <div className="space-y-2">
                            <Label>Parentesco contigo</Label>
                            <div className="flex flex-wrap gap-2">
                                {relationshipOptions.map(rel => (
                                    <button
                                        key={rel}
                                        onClick={() => updateOtherDriver('relationship', rel)}
                                        className={cn(
                                            'px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                                            data.otherDriver.relationship === rel
                                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                                        )}
                                    >
                                        {rel}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Sexo</Label>
                            <div className="flex gap-3">
                                {[{ val: 'male', label: 'Masculino' }, { val: 'female', label: 'Femenino' }].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => updateOtherDriver('sex', opt.val)}
                                        className={cn(
                                            'flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                                            data.otherDriver.sex === opt.val
                                                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50'
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input id="otherName" label="Nombre completo" placeholder="Nombre y apellidos" value={data.otherDriver.name} onChange={(e) => updateOtherDriver('name', e.target.value)} className="h-11" />
                            <Input id="otherBirthDate" type="date" label="Fecha de nacimiento" value={data.otherDriver.birthDate} onChange={(e) => updateOtherDriver('birthDate', e.target.value)} className="h-11" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button onClick={onSubmit} disabled={!isValid} className="w-full h-12 text-base">
                Ver Cotizaciones
            </Button>
        </motion.div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PASO 3: Resultados de aseguradoras
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StepInsurers({
    data,
    onChange,
    onNext,
}: {
    data: QuoteData
    onChange: (partial: Partial<QuoteData>) => void
    onNext: () => void
}) {
    const [planFilter, setPlanFilter] = useState<'amplio' | 'limitado' | 'basico'>('amplio')
    const [paymentType, setPaymentType] = useState<PaymentType>('annual')

    const currentPayment = paymentOptions.find(p => p.val === paymentType)!
    const formatMoney = (n: number) => '$' + Math.round(n).toLocaleString('es-MX')

    const selectedQuoteName = data.selectedInsurer
        ? mockQuotes.find(q => q.id === data.selectedInsurer)?.insurer
        : null

    return (
        <motion.div {...anim} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-primary">Elige tu seguro</h2>
                <p className="text-muted-foreground mt-1">
                    {data.model?.brand} {data.model?.name} {data.version?.name} {data.year}
                </p>
            </div>

            {/* Sticky continue button - appears when selection is made */}
            {data.selectedInsurer && (
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border border-primary/20 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-primary">
                            {selectedQuoteName} — {planLabels[planFilter]}
                        </span>
                    </div>
                    <Button onClick={onNext} size="sm">
                        Continuar
                    </Button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
                <div className="space-y-1 flex-1">
                    <Label className="text-xs">Forma de pago</Label>
                    <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 overflow-hidden p-1">
                        {paymentOptions.map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => setPaymentType(opt.val)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap',
                                    paymentType === opt.val ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-slate-50'
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Tipo de plan</Label>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                        {[
                            { val: 'amplio' as const, label: 'Amplio' },
                            { val: 'limitado' as const, label: 'Limitado' },
                            { val: 'basico' as const, label: 'Básico' },
                        ].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => setPlanFilter(opt.val)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-colors',
                                    planFilter === opt.val ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-slate-50'
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[50px]" />
                                <TableHead>Aseguradora</TableHead>
                                <TableHead className="text-right">Pago {currentPayment.label.toLowerCase()}</TableHead>
                                <TableHead className="text-center">Coberturas</TableHead>
                                <TableHead className="text-center">Asistencias</TableHead>
                                <TableHead className="text-right">Prima anual</TableHead>
                                <TableHead className="w-[140px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...mockQuotes]
                                .sort((a, b) => a.plans[planFilter].annualPremium - b.plans[planFilter].annualPremium)
                                .map((quote, index) => {
                                const plan = quote.plans[planFilter]
                                const displayPrice = plan.annualPremium / currentPayment.divisor
                                const isSelected = data.selectedInsurer === quote.id
                                const isCheapest = index === 0

                                return (
                                    <TableRow
                                        key={quote.id}
                                        onClick={() => onChange({ selectedInsurer: quote.id })}
                                        className={cn(
                                            'cursor-pointer transition-colors',
                                            isSelected
                                                ? 'bg-primary/5 border-l-4 border-l-primary'
                                                : 'hover:bg-slate-50/80'
                                        )}
                                    >
                                        <TableCell className="pl-3">
                                            <InsurerLogo
                                                insurerId={quote.id}
                                                name={quote.insurer}
                                                initials={quote.initials}
                                                color={quote.color}
                                                size="md"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-primary">{quote.insurer}</span>
                                                {isCheapest && (
                                                    <Badge className="bg-primary text-white text-[10px] px-1.5 py-0">
                                                        <Star className="w-2.5 h-2.5 mr-0.5" />
                                                        Top
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className="text-lg font-bold text-primary">{formatMoney(displayPrice)}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-semibold text-primary">{plan.coverages}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-semibold text-primary">+{plan.assists}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className="text-sm text-muted-foreground">{formatMoney(plan.annualPremium)}</p>
                                        </TableCell>
                                        <TableCell className="text-right pr-3">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onChange({ selectedInsurer: quote.id })
                                                    onNext()
                                                }}
                                            >
                                                Continuar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Button
                onClick={onNext}
                disabled={!data.selectedInsurer}
                className="w-full h-12 text-base"
            >
                Continuar con {selectedQuoteName ?? '...'}
            </Button>
        </motion.div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PASO 4: Confirmar datos del conductor
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StepConfirmDriver({
    data,
    onChange,
    onSubmit,
}: {
    data: QuoteData
    onChange: (partial: Partial<QuoteData>) => void
    onSubmit: () => void
}) {
    const cd = data.confirmedDriver
    const [showPayment, setShowPayment] = useState(false)

    function update<K extends keyof FullDriverData>(field: K, value: FullDriverData[K]) {
        onChange({ confirmedDriver: { ...cd, [field]: value } })
    }

    const selectedQuote = mockQuotes.find(q => q.id === data.selectedInsurer)

    // Per-field validity checks (todos obligatorios)
    const invalid = {
        firstName: cd.firstName.trim().length < 2,
        paternalLastName: cd.paternalLastName.trim().length < 2,
        maternalLastName: cd.maternalLastName.trim().length < 2,
        sex: cd.sex === '',
        birthDate: cd.birthDate === '',
        birthState: cd.birthState === '',
        email: !cd.email.includes('@'),
        phone: cd.phone.length < 10,
    }

    const isValid =
        !invalid.firstName &&
        !invalid.paternalLastName &&
        !invalid.maternalLastName &&
        !invalid.sex &&
        !invalid.birthDate &&
        !invalid.birthState &&
        !invalid.email &&
        !invalid.phone

    // Subtle highlight for fields missing data
    const missingClass = 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-300/60'

    const usageLabelConfirm = vehicleUsageOptions.find(u => u.id === data.usage)?.label ?? data.usage

    return (
        <>
            <motion.div {...anim} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Revisar y confirmar</h2>
                    <p className="text-muted-foreground mt-1">
                        Verifique que los datos sean correctos antes de continuar al pago
                    </p>
                </div>

                {/* Summary card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 divide-y divide-slate-200 text-sm overflow-hidden">
                    <div className="px-4 py-3 bg-primary/5 flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Resumen de la cotización</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Vehículo</p>
                            <p className="font-medium text-primary">{data.model?.brand} {data.model?.name} {data.year}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Versión</p>
                            <p className="font-medium text-primary">{data.version?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Aseguradora</p>
                            <p className="font-medium text-primary">{selectedQuote?.insurer}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Prima anual</p>
                            <p className="font-medium text-primary">${(selectedQuote?.plans.amplio.annualPremium ?? 0).toLocaleString('es-MX')} MXN</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Uso del vehículo</p>
                            <p className="font-medium text-primary">{usageLabelConfirm}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Conductor a asegurar</p>
                            <p className="font-medium text-primary">
                                {data.isInsured === true
                                    ? (data.driver.name || 'El contratante')
                                    : data.otherDriver.name || 'Otra persona'}
                            </p>
                        </div>
                        {data.isInsured === false && data.otherDriver.name && (
                            <div className="col-span-2">
                                <p className="text-xs text-muted-foreground">Parentesco del conductor</p>
                                <p className="font-medium text-primary">{data.otherDriver.relationship}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm text-muted-foreground">
                    Algunos campos ya están pre-llenados con la información ingresada anteriormente. Verifique que todo sea correcto.
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input id="cfName" label="Nombre(s)" placeholder="Nombre" value={cd.firstName} onChange={(e) => update('firstName', e.target.value)} className={cn('h-11', invalid.firstName && missingClass)} />
                        <Input id="cfPaternal" label="Apellido paterno" placeholder="Apellido paterno" value={cd.paternalLastName} onChange={(e) => update('paternalLastName', e.target.value)} className={cn('h-11', invalid.paternalLastName && missingClass)} />
                        <Input id="cfMaternal" label="Apellido materno" placeholder="Apellido materno" value={cd.maternalLastName} onChange={(e) => update('maternalLastName', e.target.value)} className={cn('h-11', invalid.maternalLastName && missingClass)} />
                    </div>

                    <div className={cn('space-y-2 -m-2 p-2 rounded-xl', invalid.sex && 'bg-amber-50/50 ring-1 ring-amber-300/60')}>
                        <Label>Sexo</Label>
                        <div className="flex gap-3">
                            {[{ val: 'male', label: 'Masculino' }, { val: 'female', label: 'Femenino' }].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => update('sex', opt.val)}
                                    className={cn(
                                        'flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                                        cd.sex === opt.val
                                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                            : 'border-slate-200 bg-white text-muted-foreground hover:border-primary/50',
                                        invalid.sex && cd.sex !== opt.val && 'border-amber-400'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="cfBirthDate" type="date" label="Fecha de nacimiento" value={cd.birthDate} onChange={(e) => update('birthDate', e.target.value)} className={cn('h-11', invalid.birthDate && missingClass)} />
                        <div className="w-full">
                            <label htmlFor="cfBirthState" className="block text-sm font-medium mb-1">Estado de nacimiento</label>
                            <select
                                id="cfBirthState"
                                value={cd.birthState}
                                onChange={(e) => update('birthState', e.target.value)}
                                className={cn(
                                    'flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                    invalid.birthState && missingClass
                                )}
                            >
                                <option value="">Selecciona un estado</option>
                                {mexicanStates.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="cfEmail" type="email" label="Correo electrónico" placeholder="correo@ejemplo.com" value={cd.email} onChange={(e) => update('email', e.target.value)} className={cn('h-11', invalid.email && missingClass)} />
                        <Input id="cfPhone" type="tel" inputMode="numeric" maxLength={10} label="Celular" placeholder="10 dígitos" value={cd.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))} className={cn('h-11', invalid.phone && missingClass)} />
                    </div>
                </div>

                <Button onClick={() => setShowPayment(true)} disabled={!isValid} className="w-full h-12 text-base">
                    Continuar al Pago
                </Button>
            </motion.div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPayment && selectedQuote && (
                    <PaymentModal
                        quote={selectedQuote}
                        driverName={`${cd.firstName} ${cd.paternalLastName}`}
                        onClose={() => setShowPayment(false)}
                        onSuccess={onSubmit}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

/* ─── Payment Modal ─── */

function PaymentModal({
    quote,
    driverName,
    onClose,
    onSuccess,
}: {
    quote: InsuranceQuote
    driverName: string
    onClose: () => void
    onSuccess: () => void
}) {
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState(driverName)
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [payMethod] = useState<PaymentType>('annual')
    const [processing, setProcessing] = useState(false)

    const currentPayment = paymentOptions.find(p => p.val === payMethod)!
    const amount = quote.plans.amplio.annualPremium / currentPayment.divisor
    const formatMoney = (n: number) => '$' + Math.round(n).toLocaleString('es-MX')

    function formatCardNumber(val: string) {
        const digits = val.replace(/\D/g, '').slice(0, 16)
        return digits.replace(/(.{4})/g, '$1 ').trim()
    }

    function formatExpiry(val: string) {
        const digits = val.replace(/\D/g, '').slice(0, 4)
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
        return digits
    }

    const isValid =
        cardNumber.replace(/\s/g, '').length >= 15 &&
        cardName.trim().length >= 2 &&
        expiry.length >= 4 &&
        cvv.length >= 3

    function handlePay() {
        setProcessing(true)
        setTimeout(() => {
            setProcessing(false)
            onSuccess()
        }, 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                {/* Header */}
                <div className="bg-primary p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <InsurerLogo
                                insurerId={quote.id}
                                name={quote.insurer}
                                initials={quote.initials}
                                color={quote.color}
                                size="md"
                            />
                            <div>
                                <p className="font-semibold">{quote.insurer}</p>
                                <p className="text-white/70 text-xs">Seguro de auto</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{formatMoney(amount)}</p>
                        <p className="text-white/70 text-sm">MXN / {currentPayment.label.toLowerCase()}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                        {/* Card number */}
                    <div className="space-y-2">
                        <Label className="text-xs">Número de tarjeta</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                className="pl-10 h-10 font-mono tracking-wider"
                                maxLength={19}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-xs">Nombre en la tarjeta</Label>
                        <Input
                            type="text"
                            placeholder="Como aparece en la tarjeta"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="h-10"
                        />
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Vencimiento</Label>
                            <Input
                                type="text"
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                className="h-10 font-mono"
                                maxLength={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">CVV</Label>
                            <Input
                                type="password"
                                inputMode="numeric"
                                placeholder="•••"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="h-10 font-mono"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {/* Pay button */}
                    <Button
                        onClick={handlePay}
                        disabled={!isValid || processing}
                        className="w-full h-12 text-base"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 mr-2" />
                                Pagar {formatMoney(amount)} MXN
                            </>
                        )}
                    </Button>

                    {/* Emission time notice */}
                    <div className="flex items-center gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                        <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                        <p className="text-xs text-amber-700 leading-snug">
                            En caso de error, el reembolso puede tardar <span className="font-semibold">mínimo 7 días hábiles</span>, ya que depende de las instituciones bancarias.
                        </p>
                    </div>

                    {/* Security note */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Pago seguro con encriptación SSL de 256 bits</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── Confirmación Final ─── */

function StepDone({ data }: { data: QuoteData }) {
    const selectedQuote = mockQuotes.find(q => q.id === data.selectedInsurer)

    const cd = data.confirmedDriver
    const fullName = `${cd.firstName} ${cd.paternalLastName} ${cd.maternalLastName}`.trim()

    return (
        <motion.div {...anim} className="text-center space-y-6 py-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-primary">Póliza emitida exitosamente</h2>
                <p className="text-muted-foreground mt-2">
                    <span className="font-semibold text-primary">{selectedQuote?.insurer}</span>
                </p>
                <p className="text-muted-foreground mt-1">
                    Vehículo: {data.model?.brand} {data.model?.name} {data.version?.name} {data.year}
                </p>
                <p className="text-muted-foreground mt-1">
                    Titular: {fullName}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                    Se enviará la confirmación a <span className="font-medium">{cd.email}</span>
                </p>
            </div>
            <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Nueva Cotización
                </Button>
            </div>
        </motion.div>
    )
}
