export type UserRole = 'super_admin' | 'group_lead' | 'agency_manager' | 'seller'
export type UserStatus = 'Activo' | 'Inactivo'

export interface PlatformUser {
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

export const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: 'Super Nova',
    group_lead: 'Responsable de Grupo',
    agency_manager: 'Responsable de Agencia',
    seller: 'Vendedor',
}

export const ROLE_BADGE_STYLES: Record<UserRole, string> = {
    super_admin: 'bg-primary text-white hover:bg-primary/90',
    group_lead: 'bg-accent text-white hover:bg-accent/90',
    agency_manager: 'bg-warning text-white hover:bg-warning/90',
    seller: 'bg-success text-white hover:bg-success/90',
}

export const MOCK_GROUPS = [
    'Grupo Automotriz del Norte',
    'Grupo Premium Motors',
    'Grupo Centro Occidente',
    'Grupo Península',
    'Grupo Bajío Motors',
]

export const MOCK_AGENCIES_BY_GROUP: Record<string, string[]> = {
    'Grupo Automotriz del Norte': ['Toyota Monterrey', 'Honda San Pedro', 'Nissan Apodaca', 'VW Cumbres'],
    'Grupo Premium Motors': ['Mazda Polanco', 'Toyota Santa Fe', 'Hyundai Satélite'],
    'Grupo Centro Occidente': ['Chevrolet Guadalajara', 'Ford Zapopan', 'Kia Tonalá', 'Nissan Tlajomulco', 'Honda Providencia'],
    'Grupo Península': ['Toyota Mérida', 'VW Cancún'],
    'Grupo Bajío Motors': ['Honda León', 'Mazda Querétaro'],
}

export const INITIAL_USERS: PlatformUser[] = [
    { id: '1', name: 'Javier Moreno Castillo', email: 'javier.moreno@novaplataforma.mx', phone: '55 1000 0001', role: 'super_admin', status: 'Activo', createdAt: '01/01/2024' },
    { id: '2', name: 'Arturo Benítez Valencia', email: 'abenitez@gruponorte.mx', phone: '81 1234 5678', role: 'group_lead', group: 'Grupo Automotriz del Norte', status: 'Activo', createdAt: '15/03/2022' },
    { id: '3', name: 'Isabela Cruz Alarcón', email: 'icruz@premiummotors.mx', phone: '55 9876 5432', role: 'group_lead', group: 'Grupo Premium Motors', status: 'Activo', createdAt: '08/07/2023' },
    { id: '4', name: 'Ricardo Peña Saucedo', email: 'rpsaucedo@gruponorte.mx', phone: '81 2345 6789', role: 'agency_manager', group: 'Grupo Automotriz del Norte', agency: 'Honda San Pedro', status: 'Activo', createdAt: '20/06/2022' },
    { id: '5', name: 'Paulina Esquivel Cruz', email: 'pesquivel@centrooccidente.mx', phone: '33 3456 7890', role: 'agency_manager', group: 'Grupo Centro Occidente', agency: 'Ford Zapopan', status: 'Activo', createdAt: '03/04/2022' },
    { id: '6', name: 'Daniela Mendoza Ruiz', email: 'dmendoza@peninsula.mx', phone: '99 3692 5814', role: 'agency_manager', group: 'Grupo Península', agency: 'Toyota Mérida', status: 'Activo', createdAt: '12/10/2023' },
    { id: '7', name: 'Marco Antonio Fuentes Ríos', email: 'mfuentes@gruponorte.mx', phone: '81 4567 8901', role: 'seller', group: 'Grupo Automotriz del Norte', agency: 'Toyota Monterrey', status: 'Activo', createdAt: '10/04/2023' },
    { id: '8', name: 'Valentina Herrera Soto', email: 'vherrera@premiummotors.mx', phone: '55 5678 9012', role: 'seller', group: 'Grupo Premium Motors', agency: 'Mazda Polanco', status: 'Activo', createdAt: '22/08/2023' },
    { id: '9', name: 'Eduardo Salinas Bravo', email: 'esalinas@centrooccidente.mx', phone: '33 6789 0123', role: 'seller', group: 'Grupo Centro Occidente', agency: 'Chevrolet Guadalajara', status: 'Inactivo', createdAt: '05/11/2022' },
    { id: '10', name: 'Camila Torres Vega', email: 'ctorres@centrooccidente.mx', phone: '33 7890 1234', role: 'seller', group: 'Grupo Centro Occidente', agency: 'Honda Providencia', status: 'Activo', createdAt: '14/02/2024' },
    { id: '11', name: 'Rodrigo Navarro Leal', email: 'rnavarro@peninsula.mx', phone: '99 8901 2345', role: 'seller', group: 'Grupo Península', agency: 'VW Cancún', status: 'Activo', createdAt: '08/03/2024' },
    { id: '12', name: 'Ramiro Zúñiga López', email: 'rzuniga@centrooccidente.mx', phone: '33 2468 1357', role: 'group_lead', group: 'Grupo Centro Occidente', status: 'Activo', createdAt: '22/01/2021' },
    { id: '13', name: 'Fernando Vargas Osorio', email: 'fvargas@bajiomotors.mx', phone: '47 1592 6483', role: 'group_lead', group: 'Grupo Bajío Motors', status: 'Activo', createdAt: '03/05/2022' },
]
