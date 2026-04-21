'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard, Users, Briefcase, Building2, UserCog, ShieldCheck, Contact, FileText, Truck,
    Shield, Menu, X, Plus, UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
    { name: 'Reportes', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Grupos', href: '/users/groups', icon: Briefcase },
    { name: 'Agencias', href: '/users/agencies', icon: Building2 },
    { name: 'Vendedores', href: '/users/sellers', icon: UserCog },
    { name: 'Aseguradoras', href: '/insurers', icon: ShieldCheck },
    { name: 'Clientes', href: '/clients', icon: Contact },
    { name: 'Pólizas', href: '/policies', icon: FileText },
    { name: 'Flotillas', href: '/fleets', icon: Truck },
]

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    function isActive(href: string) {
        // Exact match only — prevents /users matching when on /users/groups
        return pathname === href
    }

    // Shared styles for collapsed icon centering
    const collapsedItem = 'justify-center px-0'

    return (
        <>
            <div
                className={cn(
                    'fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
                    collapsed ? 'w-[72px]' : 'w-72'
                )}
            >
                <div className="flex grow flex-col overflow-y-auto bg-primary pb-4">
                    {/* Logo */}
                    <div className={cn(
                        'flex h-16 shrink-0 items-center mt-4 text-white px-5',
                        collapsed && 'justify-center px-0'
                    )}>
                        <Shield className="h-7 w-7 text-success shrink-0" />
                        <span className={cn(
                            'text-2xl font-bold tracking-tight transition-all duration-300 ml-2',
                            collapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100'
                        )}>
                            Nova
                        </span>
                    </div>

                    {/* Quick actions */}
                    <div className={cn('space-y-2 mt-5 px-3', collapsed && 'px-2')}>
                        <Link
                            href="/quotes/new"
                            title={collapsed ? 'Nueva Cotización' : undefined}
                            className={cn(
                                'flex items-center gap-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-600 transition-colors duration-200 h-9',
                                collapsed ? 'justify-center px-0' : 'px-3'
                            )}
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            <span className={cn(
                                'transition-all duration-300 whitespace-nowrap',
                                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                            )}>
                                Nueva Cotización
                            </span>
                        </Link>
                        <Link
                            href="/clients?new=true"
                            title={collapsed ? 'Nuevo Cliente' : undefined}
                            className={cn(
                                'flex items-center gap-2 rounded-lg border border-primary-foreground/20 text-white text-sm font-semibold hover:bg-primary-foreground/10 transition-colors duration-200 h-9',
                                collapsed ? 'justify-center px-0' : 'px-3'
                            )}
                        >
                            <UserPlus className="h-4 w-4 shrink-0" />
                            <span className={cn(
                                'transition-all duration-300 whitespace-nowrap',
                                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                            )}>
                                Nuevo Cliente
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col mt-5 px-3">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="space-y-1">
                                    {navigation.map((item) => {
                                        const itemActive = isActive(item.href)
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    title={collapsed ? item.name : undefined}
                                                    className={cn(
                                                        itemActive
                                                            ? 'bg-primary-foreground/10 text-white'
                                                            : 'text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white',
                                                        'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 h-10',
                                                        collapsed && collapsedItem
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            itemActive ? 'text-white' : 'text-primary-foreground/70 group-hover:text-white',
                                                            'h-5 w-5 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    <span className={cn(
                                                        'transition-all duration-300 whitespace-nowrap',
                                                        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                                    )}>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>

                            {/* Bottom section */}
                            <li className="mt-auto space-y-2">
                                {/* Toggle button */}
                                <button
                                    onClick={() => setCollapsed(!collapsed)}
                                    className={cn(
                                        'flex items-center gap-x-3 w-full rounded-md p-2 text-sm font-semibold text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white transition-colors duration-200 h-10',
                                        collapsed ? collapsedItem : ''
                                    )}
                                    title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                                >
                                    {collapsed
                                        ? <Menu className="h-5 w-5 shrink-0" />
                                        : <X className="h-5 w-5 shrink-0" />
                                    }
                                    <span className={cn(
                                        'transition-all duration-300 whitespace-nowrap',
                                        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                    )}>
                                        Ocultar
                                    </span>
                                </button>

                                {/* Profile */}
                                <Link
                                    href="/profile"
                                    title={collapsed ? 'Perfil de Agente' : undefined}
                                    className={cn(
                                        'flex items-center gap-x-3 px-2 py-3 text-sm font-semibold leading-6 text-white border-t border-primary-foreground/10 hover:bg-primary-foreground/5 transition-colors duration-200 rounded-md',
                                        collapsed && 'justify-center px-0'
                                    )}
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                        <span className="text-xs">AG</span>
                                    </div>
                                    <span className={cn(
                                        'transition-all duration-300 whitespace-nowrap',
                                        collapsed ? 'opacity-0 w-0 overflow-hidden sr-only' : 'opacity-100'
                                    )}>
                                        Perfil de Agente
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Spacer that pushes content */}
            <div className={cn(
                'shrink-0 transition-all duration-300 ease-in-out',
                collapsed ? 'w-[72px]' : 'w-72'
            )} />
        </>
    )
}
