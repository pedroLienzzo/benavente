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

type Cliente = {
  _id: string
  nombre: string
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [newCliente, setNewCliente] = useState<string>("")
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/clientes")
      if (!res.ok) throw new Error("Error al obtener los clientes")
      const data = await res.json()
      setClientes(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCliente(e.target.value)
    setError("")
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingCliente((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newCliente }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el cliente")
      }
      await fetchClientes()
      setNewCliente("")
      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el cliente",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCliente) return
    setError("")
    try {
      const res = await fetch(`/api/clientes/${editingCliente._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCliente),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al actualizar el cliente")
      }
      await fetchClientes()
      setEditingCliente(null)
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) return
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al eliminar el cliente")
      }
      await fetchClientes()
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      })
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#000000]">Clientes</h1>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Añadir Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre del Cliente</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Nombre del cliente"
                value={newCliente}
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
              Añadir Cliente
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Listado de Clientes</CardTitle>
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
                : clientes.map((cliente) => (
                    <TableRow key={cliente._id}>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingCliente(cliente)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Cliente</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-nombre">Nombre</Label>
                                  <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={editingCliente?.nombre || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
                                  Actualizar Cliente
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(cliente._id)}>
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

