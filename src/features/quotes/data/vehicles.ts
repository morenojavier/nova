export type VehicleVersion = {
    id: string
    name: string
    transmission: string
    engine: string
}

export type VehicleModel = {
    id: string
    brand: string
    name: string
    versions: Record<string, VehicleVersion[]> // keyed by year
}

export const vehicleUsageOptions = [
    { id: 'personal', label: 'Uso personal / particular' },
    { id: 'work-commute', label: 'Traslado al trabajo' },
    { id: 'rideshare', label: 'Plataforma (Uber, Didi, etc.)' },
    { id: 'commercial', label: 'Uso comercial / empresarial' },
    { id: 'delivery', label: 'Reparto / entregas' },
]

export const vehicleModels: VehicleModel[] = [
    {
        id: 'nissan-versa',
        brand: 'Nissan',
        name: 'Versa',
        versions: {
            '2024': [
                { id: 'versa-sense-24', name: 'Sense TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'versa-advance-24', name: 'Advance CVT', transmission: 'CVT', engine: '1.6L' },
                { id: 'versa-exclusive-24', name: 'Exclusive CVT', transmission: 'CVT', engine: '1.6L' },
                { id: 'versa-platinum-24', name: 'Platinum CVT', transmission: 'CVT', engine: '1.6L' },
            ],
            '2023': [
                { id: 'versa-sense-23', name: 'Sense TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'versa-advance-23', name: 'Advance CVT', transmission: 'CVT', engine: '1.6L' },
                { id: 'versa-exclusive-23', name: 'Exclusive CVT', transmission: 'CVT', engine: '1.6L' },
                { id: 'versa-platinum-23', name: 'Platinum CVT', transmission: 'CVT', engine: '1.6L' },
            ],
            '2022': [
                { id: 'versa-sense-22', name: 'Sense TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'versa-advance-22', name: 'Advance CVT', transmission: 'CVT', engine: '1.6L' },
                { id: 'versa-exclusive-22', name: 'Exclusive CVT', transmission: 'CVT', engine: '1.6L' },
            ],
        },
    },
    {
        id: 'nissan-sentra',
        brand: 'Nissan',
        name: 'Sentra',
        versions: {
            '2024': [
                { id: 'sentra-sense-24', name: 'Sense CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'sentra-advance-24', name: 'Advance CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'sentra-exclusive-24', name: 'Exclusive CVT', transmission: 'CVT', engine: '2.0L' },
            ],
            '2023': [
                { id: 'sentra-sense-23', name: 'Sense CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'sentra-advance-23', name: 'Advance CVT', transmission: 'CVT', engine: '2.0L' },
            ],
        },
    },
    {
        id: 'chevrolet-aveo',
        brand: 'Chevrolet',
        name: 'Aveo',
        versions: {
            '2024': [
                { id: 'aveo-ls-24', name: 'LS TM', transmission: 'Manual 5v', engine: '1.5L' },
                { id: 'aveo-lt-24', name: 'LT TM', transmission: 'Manual 5v', engine: '1.5L' },
                { id: 'aveo-ltz-24', name: 'LTZ AT', transmission: 'Automático', engine: '1.5L' },
            ],
            '2023': [
                { id: 'aveo-ls-23', name: 'LS TM', transmission: 'Manual 5v', engine: '1.5L' },
                { id: 'aveo-lt-23', name: 'LT TM', transmission: 'Manual 5v', engine: '1.5L' },
                { id: 'aveo-ltz-23', name: 'LTZ AT', transmission: 'Automático', engine: '1.5L' },
            ],
            '2022': [
                { id: 'aveo-ls-22', name: 'LS TM', transmission: 'Manual 5v', engine: '1.5L' },
                { id: 'aveo-lt-22', name: 'LT TM', transmission: 'Manual 5v', engine: '1.5L' },
            ],
        },
    },
    {
        id: 'chevrolet-onix',
        brand: 'Chevrolet',
        name: 'Onix',
        versions: {
            '2024': [
                { id: 'onix-ls-24', name: 'LS TM', transmission: 'Manual 5v', engine: '1.0T' },
                { id: 'onix-lt-24', name: 'LT AT', transmission: 'Automático 6v', engine: '1.0T' },
                { id: 'onix-premier-24', name: 'Premier AT', transmission: 'Automático 6v', engine: '1.0T' },
            ],
            '2023': [
                { id: 'onix-ls-23', name: 'LS TM', transmission: 'Manual 5v', engine: '1.0T' },
                { id: 'onix-lt-23', name: 'LT AT', transmission: 'Automático 6v', engine: '1.0T' },
            ],
        },
    },
    {
        id: 'vw-jetta',
        brand: 'Volkswagen',
        name: 'Jetta',
        versions: {
            '2024': [
                { id: 'jetta-trend-24', name: 'Trendline TM', transmission: 'Manual 6v', engine: '1.4T' },
                { id: 'jetta-comfort-24', name: 'Comfortline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
                { id: 'jetta-highline-24', name: 'Highline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
                { id: 'jetta-rline-24', name: 'R-Line AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
            ],
            '2023': [
                { id: 'jetta-trend-23', name: 'Trendline TM', transmission: 'Manual 6v', engine: '1.4T' },
                { id: 'jetta-comfort-23', name: 'Comfortline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
                { id: 'jetta-highline-23', name: 'Highline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
            ],
            '2022': [
                { id: 'jetta-trend-22', name: 'Trendline TM', transmission: 'Manual 6v', engine: '1.4T' },
                { id: 'jetta-comfort-22', name: 'Comfortline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
                { id: 'jetta-highline-22', name: 'Highline AT', transmission: 'Tiptronic 6v', engine: '1.4T' },
            ],
        },
    },
    {
        id: 'vw-virtus',
        brand: 'Volkswagen',
        name: 'Virtus',
        versions: {
            '2024': [
                { id: 'virtus-trend-24', name: 'Trendline TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'virtus-comfort-24', name: 'Comfortline AT', transmission: 'Tiptronic 6v', engine: '1.6L' },
            ],
            '2023': [
                { id: 'virtus-trend-23', name: 'Trendline TM', transmission: 'Manual 6v', engine: '1.6L' },
            ],
        },
    },
    {
        id: 'toyota-corolla',
        brand: 'Toyota',
        name: 'Corolla',
        versions: {
            '2024': [
                { id: 'corolla-base-24', name: 'Base TM', transmission: 'Manual 6v', engine: '2.0L' },
                { id: 'corolla-se-24', name: 'SE CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'corolla-xle-24', name: 'XLE CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'corolla-hybrid-24', name: 'Hybrid LE', transmission: 'eCVT', engine: '1.8L Híbrido' },
            ],
            '2023': [
                { id: 'corolla-base-23', name: 'Base TM', transmission: 'Manual 6v', engine: '2.0L' },
                { id: 'corolla-se-23', name: 'SE CVT', transmission: 'CVT', engine: '2.0L' },
                { id: 'corolla-hybrid-23', name: 'Hybrid LE', transmission: 'eCVT', engine: '1.8L Híbrido' },
            ],
            '2022': [
                { id: 'corolla-base-22', name: 'Base TM', transmission: 'Manual 6v', engine: '2.0L' },
                { id: 'corolla-se-22', name: 'SE CVT', transmission: 'CVT', engine: '2.0L' },
            ],
        },
    },
    {
        id: 'hyundai-accent',
        brand: 'Hyundai',
        name: 'Accent',
        versions: {
            '2024': [
                { id: 'accent-gl-24', name: 'GL TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'accent-gls-24', name: 'GLS AT', transmission: 'Automático 6v', engine: '1.6L' },
                { id: 'accent-limited-24', name: 'Limited AT', transmission: 'Automático 6v', engine: '1.6L' },
            ],
            '2023': [
                { id: 'accent-gl-23', name: 'GL TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'accent-gls-23', name: 'GLS AT', transmission: 'Automático 6v', engine: '1.6L' },
            ],
            '2022': [
                { id: 'accent-gl-22', name: 'GL TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'accent-gls-22', name: 'GLS AT', transmission: 'Automático 6v', engine: '1.6L' },
            ],
        },
    },
    {
        id: 'mazda-3',
        brand: 'Mazda',
        name: 'Mazda 3',
        versions: {
            '2024': [
                { id: 'mazda3-tm-24', name: 'Sedán TM', transmission: 'Manual 6v', engine: '2.5L' },
                { id: 'mazda3-at-24', name: 'Sedán AT', transmission: 'Automático 6v', engine: '2.5L' },
                { id: 'mazda3-signature-24', name: 'Sedán Signature AT', transmission: 'Automático 6v', engine: '2.5L Turbo' },
            ],
            '2023': [
                { id: 'mazda3-tm-23', name: 'Sedán TM', transmission: 'Manual 6v', engine: '2.5L' },
                { id: 'mazda3-at-23', name: 'Sedán AT', transmission: 'Automático 6v', engine: '2.5L' },
            ],
            '2022': [
                { id: 'mazda3-tm-22', name: 'Sedán TM', transmission: 'Manual 6v', engine: '2.5L' },
                { id: 'mazda3-at-22', name: 'Sedán AT', transmission: 'Automático 6v', engine: '2.5L' },
            ],
        },
    },
    {
        id: 'kia-rio',
        brand: 'Kia',
        name: 'Rio',
        versions: {
            '2024': [
                { id: 'rio-lx-24', name: 'LX TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'rio-ex-24', name: 'EX AT', transmission: 'Automático 6v', engine: '1.6L' },
            ],
            '2023': [
                { id: 'rio-lx-23', name: 'LX TM', transmission: 'Manual 6v', engine: '1.6L' },
                { id: 'rio-ex-23', name: 'EX AT', transmission: 'Automático 6v', engine: '1.6L' },
            ],
        },
    },
]

// Get unique brands
export function getBrands(): string[] {
    const brands = new Set(vehicleModels.map(m => m.brand))
    return Array.from(brands).sort()
}

// Get models for a brand, optionally filtered by year
export function getModelsByBrand(brand: string, year?: string): VehicleModel[] {
    let models = vehicleModels.filter(m => m.brand === brand)
    if (year) {
        models = models.filter(m => (m.versions[year]?.length ?? 0) > 0)
    }
    return models
}

// Get years available for a specific brand (only years that have at least one model)
export function getYearsForBrand(brand: string): string[] {
    const years = new Set<string>()
    vehicleModels
        .filter(m => m.brand === brand)
        .forEach(m => Object.keys(m.versions).forEach(y => years.add(y)))
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
}

// Get all years that have any model
export function getAvailableYears(): string[] {
    const years = new Set<string>()
    vehicleModels.forEach(m => Object.keys(m.versions).forEach(y => years.add(y)))
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
}

// Search models (legacy, used in step 1 fallback)
export function searchModels(query: string, year?: string): VehicleModel[] {
    let results = vehicleModels
    if (year) {
        results = results.filter(m => (m.versions[year]?.length ?? 0) > 0)
    }
    const q = query.toLowerCase().trim()
    if (!q) return results
    return results.filter(
        m => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
    )
}

// Get versions for a model + year
export function getVersions(modelId: string, year: string): VehicleVersion[] {
    const model = vehicleModels.find(m => m.id === modelId)
    if (!model) return []
    return model.versions[year] ?? []
}
