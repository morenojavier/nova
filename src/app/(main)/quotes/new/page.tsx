'use client'

import { QuoteWizard } from '@/features/quotes/components/quote-wizard'

export default function NewQuotePage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Nueva Cotización</h1>
                <p className="text-muted-foreground mt-2">
                    Cotiza un seguro de auto en minutos.
                </p>
            </div>

            <QuoteWizard />
        </div>
    )
}
