import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export const metadata = {
  title: 'Iniciar Sesión | Nova',
}

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Bienvenido de vuelta</h1>
        <p className="mt-2 text-muted-foreground">Ingresa tus credenciales para acceder</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
