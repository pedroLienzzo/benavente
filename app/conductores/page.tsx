"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2 } from "lucide-react"
import { DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

type Conductor = {
  _id: string
  nombre: string
  matriculaAsignada: string
  transportistaAsociado: string
  correo: string
}

type ConductorData = {
  vehiculos: { _id: string; matricula: string }[]
  transportistas: { _id: string; nombre: string }[]
}

export default function Conductores() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [conductorData, setConductorData] = useState<ConductorData>({ vehiculos: [], transportistas: [] })
  const [newConductor, setNewConductor] = useState<Omit<Conductor, "_id">>({
    nombre: "",
    matriculaAsignada: "",
    transportistaAsociado: "",
    correo: "",
  })
  const [newPassword, setNewPassword] = useState("")
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null)
  const [editingPassword, setEditingPassword] = useState("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchConductores()
    fetchConductorData()
  }, [])

  const fetchConductores = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/conductores")
      if (!res.ok) throw new Error("Error al obtener los conductores")
      const data = await res.json()
      setConductores(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los conductores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConductorData = async () => {
    try {
      const res = await fetch("/api/conductor-data")
      if (!res.ok) throw new Error("Error al obtener los datos para el conductor")
      const data = await res.json()
      setConductorData(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos para el conductor",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewConductor((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingConductor((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (value: string, field: "matriculaAsignada" | "transportistaAsociado") => {
    setNewConductor((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleEditSelectChange = (value: string, field: "matriculaAsignada" | "transportistaAsociado") => {
    setEditingConductor((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newConductor, contraseña: newPassword }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el conductor")
      }
      await fetchConductores()
      setNewConductor({
        nombre: "",
        matriculaAsignada: "",
        transportistaAsociado: "",
        correo: "",
      })
      setNewPassword("")
      toast({
        title: "Éxito",
        description: "Conductor creado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el conductor",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingConductor) return
    setError("")
    try {
      const dataToUpdate = { ...editingConductor }
      if (editingPassword) {
        dataToUpdate.contraseña = editingPassword
      }
      const res = await fetch(`/api/conductores/${editingConductor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al actualizar el conductor")
      }
      await fetchConductores()
      setEditingConductor(null)
      setEditingPassword("")
      toast({
        title: "Éxito",
        description: "Conductor actualizado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el conductor",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este conductor?")) return
    try {
      const res = await fetch(`/api/conductores/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al eliminar el conductor")
      }
      await fetchConductores()
      toast({
        title: "Éxito",
        description: "Conductor eliminado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el conductor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#000000]">Conductores</h1>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Añadir Nuevo Conductor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre del conductor"
                  value={newConductor.nombre}
                  onChange={handleInputChange}
                  className="border-[#dadada]"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="matriculaAsignada">Matrícula Asignada</Label>
                <Select
                  value={newConductor.matriculaAsignada}
                  onValueChange={(value) => handleSelectChange(value, "matriculaAsignada")}
                >
                  <SelectTrigger id="matriculaAsignada" className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar matrícula" />
                  </SelectTrigger>
                  <SelectContent>
                    {conductorData.vehiculos.map((vehiculo) => (
                      <SelectItem key={vehiculo._id} value={vehiculo.matricula}>
                        {vehiculo.matricula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="transportistaAsociado">Transportista Asociado</Label>
                <Select
                  value={newConductor.transportistaAsociado}
                  onValueChange={(value) => handleSelectChange(value, "transportistaAsociado")}
                >
                  <SelectTrigger id="transportistaAsociado" className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar transportista" />
                  </SelectTrigger>
                  <SelectContent>
                    {conductorData.transportistas.map((transportista) => (
                      <SelectItem key={transportista._id} value={transportista.nombre}>
                        {transportista.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="Correo electrónico del conductor"
                  value={newConductor.correo}
                  onChange={handleInputChange}
                  className="border-[#dadada]"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contraseña">Contraseña</Label>
                <Input
                  id="contraseña"
                  name="contraseña"
                  type="password"
                  placeholder="Contraseña del conductor"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-[#dadada]"
                  required
                  minLength={8}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
              Añadir Conductor
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Listado de Conductores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#626262]">Nombre</TableHead>
                <TableHead className="text-[#626262]">Matrícula Asignada</TableHead>
                <TableHead className="text-[#626262]">Transportista Asociado</TableHead>
                <TableHead className="text-[#626262]">Correo Electrónico</TableHead>
                <TableHead className="text-[#626262]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : conductores.map((conductor) => (
                    <TableRow key={conductor._id}>
                      <TableCell>{conductor.nombre}</TableCell>
                      <TableCell>{conductor.matriculaAsignada}</TableCell>
                      <TableCell>{conductor.transportistaAsociado}</TableCell>
                      <TableCell>{conductor.correo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingConductor(conductor)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Conductor</DialogTitle>
                                <DialogDescription>
                                  Modifique los datos del conductor y haga clic en "Actualizar Conductor" para guardar
                                  los cambios.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-nombre">Nombre</Label>
                                  <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={editingConductor?.nombre || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-matriculaAsignada">Matrícula Asignada</Label>
                                  <Select
                                    value={editingConductor?.matriculaAsignada || ""}
                                    onValueChange={(value) => handleEditSelectChange(value, "matriculaAsignada")}
                                  >
                                    <SelectTrigger id="edit-matriculaAsignada" className="border-[#dadada]">
                                      <SelectValue placeholder="Seleccionar matrícula" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {conductorData.vehiculos.map((vehiculo) => (
                                        <SelectItem key={vehiculo._id} value={vehiculo.matricula}>
                                          {vehiculo.matricula}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-transportistaAsociado">Transportista Asociado</Label>
                                  <Select
                                    value={editingConductor?.transportistaAsociado || ""}
                                    onValueChange={(value) => handleEditSelectChange(value, "transportistaAsociado")}
                                  >
                                    <SelectTrigger id="edit-transportistaAsociado" className="border-[#dadada]">
                                      <SelectValue placeholder="Seleccionar transportista" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {conductorData.transportistas.map((transportista) => (
                                        <SelectItem key={transportista._id} value={transportista.nombre}>
                                          {transportista.nombre}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-correo">Correo Electrónico</Label>
                                  <Input
                                    id="edit-correo"
                                    name="correo"
                                    type="email"
                                    value={editingConductor?.correo || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-contraseña">
                                    Nueva Contraseña (dejar en blanco para no cambiar)
                                  </Label>
                                  <Input
                                    id="edit-contraseña"
                                    name="contraseña"
                                    type="password"
                                    value={editingPassword}
                                    onChange={(e) => setEditingPassword(e.target.value)}
                                    className="border-[#dadada]"
                                    minLength={8}
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
                                  Actualizar Conductor
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(conductor._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

