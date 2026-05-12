'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Size = 'xs' | 'sm' | 'md' | 'lg'

const sizeMap: Record<Size, { box: string; text: string }> = {
    xs: { box: 'w-7 h-7 rounded-md', text: 'text-[10px]' },
    sm: { box: 'w-9 h-9 rounded-lg', text: 'text-[11px]' },
    md: { box: 'w-10 h-10 rounded-lg', text: 'text-xs' },
    lg: { box: 'w-12 h-12 rounded-xl', text: 'text-sm' },
}

interface InsurerLogoProps {
    insurerId: string
    name: string
    initials: string
    color: string
    size?: Size
    className?: string
}

/**
 * Logo de aseguradora con fallback automático a iniciales.
 * Busca `/insurers/{insurerId}.png` y si no existe, muestra un cuadro
 * con el color de marca y las iniciales.
 */
export function InsurerLogo({
    insurerId,
    name,
    initials,
    color,
    size = 'md',
    className,
}: InsurerLogoProps) {
    const [errored, setErrored] = useState(false)
    const dim = sizeMap[size]

    // Normalize to a clean slug: lowercase, strip accents, drop suffixes/spaces
    const cleanId = insurerId
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')           // remove accents
        .replace(/\s+seguros?$/i, '')              // strip trailing "Seguros"
        .replace(/-\d+$/, '')                      // strip trailing "-1", "-2", etc.
        .replace(/[^a-zA-Z0-9]/g, '')              // remove anything non-alphanumeric
        .toLowerCase()

    if (errored) {
        return (
            <div
                className={cn('flex items-center justify-center text-white font-bold shrink-0', dim.box, dim.text, className)}
                style={{ backgroundColor: color }}
                aria-label={name}
            >
                {initials}
            </div>
        )
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center bg-white border border-slate-200 overflow-hidden shrink-0',
                dim.box,
                className
            )}
            aria-label={name}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`/insurers/${cleanId}.svg`}
                alt={name}
                onError={() => setErrored(true)}
                className="w-full h-full object-contain p-0.5"
            />
        </div>
    )
}
