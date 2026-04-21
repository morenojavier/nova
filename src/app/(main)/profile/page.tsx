import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Building, ShieldCheck } from 'lucide-react'

export const metadata = {
    title: 'Mi Perfil | Nova'
}

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Perfil de Agente</h1>
                <p className="text-muted-foreground mt-2">
                    Gestiona tu información personal y configuración de la cuenta.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tarjeta de Resumen Izquierda */}
                <Card className="md:col-span-1 shadow-sm">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                            <span className="text-3xl font-bold text-primary">AG</span>
                        </div>
                        <h2 className="text-xl font-bold">Agente Demo</h2>
                        <p className="text-sm text-muted-foreground mb-4">agente@intervita.com</p>
                        <Badge className="bg-success hover:bg-success mb-6">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Cuenta Verificada
                        </Badge>

                        <div className="w-full space-y-4 text-sm text-left border-t pt-4">
                            <div className="flex items-center text-muted-foreground">
                                <Building className="w-4 h-4 mr-2 text-primary" />
                                Agencia Nova Sur
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 text-primary" />
                                +52 55 1234 5678
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                CDMX, México
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulario de Configuración Derecha */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Detalles de la Cuenta</CardTitle>
                        <CardDescription>Actualiza tu información pública de agente y datos de contacto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombres</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="firstName" defaultValue="Agente" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellidos</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="lastName" defaultValue="Demo" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" defaultValue="agente@intervita.com" className="pl-10" disabled />
                                </div>
                                <p className="text-xs text-muted-foreground">El correo está vinculado a tu cuenta principal y no puede ser modificado aquí.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono Móvil</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" type="tel" defaultValue="+52 55 1234 5678" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agency">Agencia Asignada</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="agency" defaultValue="Nova Sur" className="pl-10" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button variant="outline" className="mr-3">Cancelar</Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
