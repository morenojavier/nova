import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
            <Shield className="h-6 w-6 text-success" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Nova</span>
        </Link>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-success" />
            Plataforma de Gestión de Seguros
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Tu cartera de seguros,<br />
            siempre bajo control.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Administra pólizas, cotizaciones y renovaciones desde un solo lugar.
          </p>
        </div>

        <div />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-success transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-primary tracking-tight">Nova</span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
