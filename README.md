# Nova — Plataforma de Gestión de Seguros

Plataforma web para agentes y agencias de seguros en México. Incluye gestión de clientes, pólizas, flotillas, cotizaciones multi-aseguradora y reportes.

## Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Backend**: Supabase (Auth + DB + RLS)
- **Validación**: Zod
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.local.example` a `.env.local` y configura:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para OAuth redirects) |

## Scripts

```bash
npm run dev      # Desarrollo (Turbopack)
npm run build    # Build de producción
npm run start    # Iniciar build de producción
npm run lint     # Linter
```

## Deploy en Vercel

1. Importa el repo desde [vercel.com/new](https://vercel.com/new)
2. Agrega las variables de entorno (ver arriba)
3. Deploy — Vercel detecta Next.js automáticamente

Después del primer deploy, actualiza `NEXT_PUBLIC_SITE_URL` con la URL real y configura esa URL en Supabase Dashboard → Authentication → URL Configuration.

## Estructura

```
src/
├── app/
│   ├── (auth)/            # Rutas de autenticación
│   └── (main)/            # App principal con sidebar
│       ├── dashboard/     # Reportes
│       ├── clients/
│       ├── policies/
│       ├── insurers/
│       ├── fleets/
│       ├── quotes/new/
│       └── users/
├── features/              # Lógica por dominio
│   ├── auth/
│   ├── quotes/
│   └── users/
├── components/            # UI compartida
│   ├── ui/                # Primitivos
│   └── layout/            # Sidebar, etc
├── lib/
│   └── supabase/          # Clients de Supabase
└── actions/               # Server Actions
```

## Features principales

- Autenticación con Supabase (Email + Google OAuth ready)
- Dashboard de reportes con 6 vistas (por aseguradora / grupo / agencia y sus cruces)
- CRUD de clientes con historial por vehículo y pagos
- Comparador de 7 aseguradoras (GNP, CHUBB, HDI, Quálitas, Mapfre, Zurich, AXA)
- Wizard de cotización en 4 pasos con confirmación
- Gestión de flotillas con documentación legal (CURP, RFC, Acta constitutiva, etc.)
- Sistema de usuarios con 4 roles jerárquicos
