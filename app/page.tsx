import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido a Logística Rube</h1>
      <p className="text-xl">Sistema de Gestión Logística para Transportistas</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Partes de Trabajo</CardTitle>
            <CardDescription>Gestiona los partes de trabajo diarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Crea, edita y visualiza los partes de trabajo de los conductores.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conductores</CardTitle>
            <CardDescription>Administra la información de los conductores</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Registra nuevos conductores y gestiona sus perfiles.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vehículos</CardTitle>
            <CardDescription>Controla la flota de vehículos</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Mantén un registro actualizado de todos los vehículos en servicio.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

