"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Vehiculo = {
  _id: string
  matricula: string
}

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [newVehiculo, setNewVehiculo] = useState<string>("")
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchVehiculos()
  }, [])

  const fetchVehiculos = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/vehiculos")
      if (!res.ok) throw new Error("Error al obtener los vehículos")
      const data = await res.json()
      setVehiculos(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los vehículos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVehiculo(e.target.value)
    setError("")
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingVehiculo((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula: newVehiculo }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el vehículo")
      }
      await fetchVehiculos()
      setNewVehiculo("")
      toast({
        title: "Éxito",
        description: "Vehículo creado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el vehículo",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVehiculo) return
    setError("")
    try {
      const res = await fetch(`/api/vehiculos/${editingVehiculo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVehiculo),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al actualizar el vehículo")
      }
      await fetchVehiculos()
      setEditingVehiculo(null)
      toast({
        title: "Éxito",
        description: "Vehículo actualizado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el vehículo",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este vehículo?")) return
    try {
      const res = await fetch(`/api/vehiculos/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al eliminar el vehículo")
      }
      await fetchVehiculos()
      toast({
        title: "Éxito",
        description: "Vehículo eliminado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el vehículo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#000000]">Vehículos</h1>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Añadir Nuevo Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="matricula">Matrícula del Vehículo</Label>
              <Input
                id="matricula"
                name="matricula"
                placeholder="Matrícula del vehículo"
                value={newVehiculo}
                onChange={handleInputChange}
                className="border-[#dadada]"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
              Añadir Vehículo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Listado de Vehículos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#626262]">Matrícula</TableHead>
                <TableHead className="text-[#626262]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : vehiculos.map((vehiculo) => (
                    <TableRow key={vehiculo._id}>
                      <TableCell>{vehiculo.matricula}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingVehiculo(vehiculo)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Vehículo</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-matricula">Matrícula</Label>
                                  <Input
                                    id="edit-matricula"
                                    name="matricula"
                                    value={editingVehiculo?.matricula || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
                                  Actualizar Vehículo
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(vehiculo._id)}>
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

