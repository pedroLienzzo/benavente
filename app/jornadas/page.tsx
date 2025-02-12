// app/jornadas/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Jornada } from "@/types/jornada";

export default function JornadasPage() {
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [newJornada, setNewJornada] = useState("");
  const [editingJornada, setEditingJornada] = useState<Jornada | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJornadas();
  }, []);

  const fetchJornadas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jornadas");
      if (!res.ok) throw new Error("Error al obtener las jornadas");
      const data = await res.json();
      setJornadas(data);
    } catch (error: any) {
      console.error("Error fetching jornadas:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las jornadas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewJornadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewJornada(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jornadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newJornada }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear la jornada");
      }
      await fetchJornadas();
      setNewJornada("");
      toast({
        title: "Éxito",
        description: "Jornada creada correctamente",
      });
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la jornada",
        variant: "destructive",
      });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingJornada((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJornada) return;
    try {
      const res = await fetch(`/api/jornadas/${editingJornada._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingJornada),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar la jornada");
      }
      await fetchJornadas();
      setEditingJornada(null);
      toast({
        title: "Éxito",
        description: "Jornada actualizada correctamente",
      });
    } catch (error: any) {
      console.error("Error updating jornada:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la jornada",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta jornada?")) return;
    try {
      const res = await fetch(`/api/jornadas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar la jornada");
      }
      await fetchJornadas();
      toast({
        title: "Éxito",
        description: "Jornada eliminada correctamente",
      });
    } catch (error: any) {
      console.error("Error deleting jornada:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la jornada",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#000000]">Jornadas</h1>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Añadir Nueva Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre de la Jornada</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Nombre de la jornada"
                value={newJornada}
                onChange={handleNewJornadaChange}
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
              Añadir Jornada
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#dadada]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#000000]">Listado de Jornadas</CardTitle>
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
                : jornadas.map((jornada) => (
                    <TableRow key={jornada._id}>
                      <TableCell>{jornada.nombre}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingJornada(jornada)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Jornada</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                  <Label htmlFor="edit-nombre">Nombre</Label>
                                  <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={editingJornada?.nombre || ""}
                                    onChange={handleEditInputChange}
                                    className="border-[#dadada]"
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-[#002fff] hover:bg-[#002fff]/90 text-white">
                                  Actualizar Jornada
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(jornada._id)}>
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
  );
}