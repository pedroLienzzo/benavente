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

type Material = {
  _id: string
  nombre: string
}

export default function Materiales() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [newMaterial, setNewMaterial] = useState<string>("")
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMateriales()
  }, [])

  const fetchMateriales = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/materiales")
      if (!res.ok) throw new Error("Error al obtener los materiales")
      const data = await res.json()
      setMateriales(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los materiales",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMaterial(e.target.value)
    setError("")
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingMaterial((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/materiales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newMaterial }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el material")
      }
      await fetchMateriales()
      setNewMaterial("")
      toast({
        title: "Éxito",
        description: "Material creado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el material",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMaterial) return
    setError("")
    try {
      const res = await fetch(`/api/materiales/${editingMaterial._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMaterial),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al actualizar el material")
      }
      await fetchMateriales()
      setEditingMaterial(null)
      toast({
        title: "Éxito",
        description: "Material actualizado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el material",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este material?")) return
    try {
      const res = await fetch(`/api/materiales/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al eliminar el material")
      }
      await fetchMateriales()
      toast({
        title: "Éxito",
        description: "Material eliminado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el material",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#000000]">Materiales</h1>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Añadir Nuevo Material</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre del Material</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Nombre del material"
                value={newMaterial}
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
              Añadir Material
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Listado de Materiales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#626262]">Nombre</TableHead>
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
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : materiales.map((material) => (
                    <TableRow key={material._id}>
                      <TableCell>{material.nombre}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingMaterial(material)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Material</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-nombre">Nombre</Label>
                                  <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={editingMaterial?.nombre || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
                                  Actualizar Material
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(material._id)}>
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

