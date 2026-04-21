import Link from 'next/link'
import { SignupForm } from '@/features/auth/components'

export const metadata = {
  title: 'Crear Cuenta | Nova',
}

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Crea tu cuenta</h1>
        <p className="mt-2 text-muted-foreground">Empieza a gestionar tu cartera de seguros</p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
