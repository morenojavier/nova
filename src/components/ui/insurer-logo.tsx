import { cn } from '@/lib/utils'

type Size = 'xs' | 'sm' | 'md' | 'lg'

const sizeMap: Record<Size, { box: string; text: string }> = {
    xs: { box: 'w-7 h-7 rounded-md', text: 'text-[10px]' },
    sm: { box: 'w-9 h-9 rounded-lg', text: 'text-[11px]' },
    md: { box: 'w-10 h-10 rounded-lg', text: 'text-xs' },
    lg: { box: 'w-14 h-14 rounded-lg', text: 'text-sm' },
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
 * Cuadro con las iniciales de la aseguradora sobre el color de marca.
 */
export function InsurerLogo({
    name,
    initials,
    color,
    size = 'md',
    className,
}: InsurerLogoProps) {
    const dim = sizeMap[size]
    return (
        <div
            className={cn(
                'flex items-center justify-center text-white font-bold shrink-0',
                dim.box,
                dim.text,
                className
            )}
            style={{ backgroundColor: color }}
            aria-label={name}
        >
            {initials}
        </div>
    )
}
