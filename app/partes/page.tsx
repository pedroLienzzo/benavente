"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { generateExcel } from "@/lib/excelUtils"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

import { ParteTrabajo } from "@/types/parte"

export default function PartesPage() {
  const [partes, setPartes] = useState<ParteTrabajo[]>([])
  const [filteredPartes, setFilteredPartes] = useState<ParteTrabajo[]>([])
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroConductor, setFiltroConductor] = useState("")
  const [filtroMatricula, setFiltroMatricula] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchPartes()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [partes, filtroTexto, filtroFecha, filtroConductor, filtroMatricula, filtroEstado])

  const fetchPartes = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/partes")
      if (!res.ok) throw new Error("Error al obtener los partes de trabajo")
      const data = await res.json()
      // console.log("Frontend: Fetched partes:", data)
      setPartes(data)
      setFilteredPartes(data)
    } catch (error) {
      console.error("Frontend: Error fetching partes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los partes de trabajo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = partes

    if (filtroTexto) {
      const searchTerm = filtroTexto.toLowerCase()
      result = result.filter(
        (parte) =>
          parte.conductor.toLowerCase().includes(searchTerm) ||
          parte.matricula.toLowerCase().includes(searchTerm) ||
          parte.transportista.toLowerCase().includes(searchTerm),
      )
    }

    if (filtroFecha) {
      result = result.filter((parte) => parte.fecha.includes(filtroFecha))
    }

    if (filtroConductor && filtroConductor !== "all") {
      result = result.filter((parte) => parte.conductor === filtroConductor)
    }

    if (filtroMatricula && filtroMatricula !== "all") {
      result = result.filter((parte) => parte.matricula === filtroMatricula)
    }

    if (filtroEstado && filtroEstado !== "all") {
      result = result.filter((parte) => parte.estado === filtroEstado)
    }

    setFilteredPartes(result)
  }

  const conductoresUnicos = Array.from(new Set(partes.map((parte) => parte.conductor)))
  const matriculasUnicas = Array.from(new Set(partes.map((parte) => parte.matricula)))

  const handleDownload = () => {
    const dataToExport = filteredPartes.map((parte) => ({
      Fecha: new Date(parte.fecha).toLocaleDateString(),
      Matrícula: parte.matricula,
      Kilómetros: parte.kilometros,
      Conductor: parte.conductor,
      Transportista: parte.transportista,
      "Nº Líneas": parte.lineas.length,
      Estado: parte.estado,
    }))
    generateExcel(dataToExport, "partes_de_trabajo.xlsx")
  }

  const handleDelete = async (parteId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este parte?")) {
      try {
        const res = await fetch(`/api/partes/${parteId}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('No se pudo eliminar el parte');
        
        // Actualiza el estado local
        setPartes(prev => prev.filter(parte => parte._id !== parteId));
        
        toast({
          title: "Parte eliminado",
          description: "El parte ha sido eliminado correctamente.",
        });
      } catch (error) {
        console.error('Error eliminando parte:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el parte. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partes de Trabajo</h1>
        <Button asChild className="bg-[#002fff] hover:bg-[#002fff]/90 text-white rounded-full">
          <Link href="/partes/nuevo">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Parte
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#dadada] p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            className="w-48 border-[#dadada]"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
          <Select value={filtroConductor} onValueChange={setFiltroConductor}>
            <SelectTrigger className="w-40 border-[#dadada]">
              <SelectValue placeholder="Conductores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {conductoresUnicos.map((conductor) => (
                <SelectItem key={conductor} value={conductor}>
                  {conductor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroMatricula} onValueChange={setFiltroMatricula}>
            <SelectTrigger className="w-40 border-[#dadada]">
              <SelectValue placeholder="Matriculas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {matriculasUnicas.map((matricula) => (
                <SelectItem key={matricula} value={matricula}>
                  {matricula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 border-[#dadada]"
              placeholder="Buscar..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-40 border-[#dadada]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-[#dadada]" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dadada] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Matrícula</TableHead>
              <TableHead className="font-semibold">Kilómetros</TableHead>
              <TableHead className="font-semibold">Conductor</TableHead>
              <TableHead className="font-semibold">Transportista</TableHead>
              <TableHead className="font-semibold">Nº Líneas</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
               
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
              : filteredPartes.map((parte) => (
                <TableRow key={parte._id}>
                  <TableCell>{new Date(parte.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{parte.matricula}</TableCell>
                  <TableCell>{parte.kilometros}</TableCell>
                  <TableCell>{parte.conductor}</TableCell>
                  <TableCell>{parte.transportista}</TableCell>
                  <TableCell>{parte.lineas.length}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${parte.estado === "Pendiente" ? "bg-[#ffa100] text-white" : "bg-green-100 text-green-800"
                        }`}
                    >
                      {parte.estado}
                    </span>
                  </TableCell>
              
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/partes/editar/${parte._id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(parte._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

