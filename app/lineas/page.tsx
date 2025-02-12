"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { generateExcel } from "@/lib/excelUtils"
import { Skeleton } from "@/components/ui/skeleton"
import { LINEAS_TABLE_HEADERS } from "@/config/constants"
import { DataTableHeader } from "@/components/ui/data-table-header"

import { Linea } from "@/types/linea"

export default function LineasPage() {
  const [lineas, setLineas] = useState<Linea[]>([])
  const [filteredLineas, setFilteredLineas] = useState<Linea[]>([])
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroConductor, setFiltroConductor] = useState("")
  const [filtroMatricula, setFiltroMatricula] = useState("")
  const [filtroCliente, setFiltroCliente] = useState("")
  const [filtroJornada, setFiltroJornada] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLineas()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [lineas, filtroTexto, filtroFecha, filtroConductor, filtroMatricula, filtroCliente, filtroJornada, filtroEstado])

  const fetchLineas = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/lineas")
      if (!res.ok) throw new Error("Error al obtener las líneas")
      const data = await res.json()
      setLineas(data)
      setFilteredLineas(data)
    } catch (error) {
      console.error("Frontend: Error fetching lineas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las líneas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = lineas

    if (filtroTexto) {
      const searchTerm = filtroTexto.toLowerCase()
      result = result.filter(
        (linea) =>
          linea.conductor.toLowerCase().includes(searchTerm) ||
          linea.vehiculo.toLowerCase().includes(searchTerm) ||
          linea.transportista.toLowerCase().includes(searchTerm) ||
          linea.cliente.toLowerCase().includes(searchTerm) ||
          linea.jornada.toLowerCase().includes(searchTerm) ||
          linea.estado.toLowerCase().includes(searchTerm)
      )
    }

    if (filtroFecha) {
      result = result.filter((linea) => linea.fecha.includes(filtroFecha))
    }

    if (filtroConductor && filtroConductor !== "all") {
      result = result.filter((linea) => linea.conductor === filtroConductor)
    }

    if (filtroMatricula && filtroMatricula !== "all") {
      result = result.filter((linea) => linea.vehiculo === filtroMatricula)
    }

    if (filtroCliente && filtroCliente !== "all") {
      result = result.filter((linea) => linea.cliente === filtroCliente)
    }

    if (filtroJornada && filtroJornada !== "all") {
      result = result.filter((linea) => linea.jornada === filtroJornada)
    }

    if (filtroEstado && filtroEstado !== "all") {
      result = result.filter((linea) => linea.estado === filtroEstado)
    }

    setFilteredLineas(result)
  }

  const conductoresUnicos = Array.from(new Set(lineas.map((linea) => linea.conductor)))
  const matriculasUnicas = Array.from(new Set(lineas.map((linea) => linea.vehiculo)))
  const clientesUnicos = Array.from(new Set(lineas.map((linea) => linea.cliente)))
  const jornadasUnicas = Array.from(new Set(lineas.map((linea) => linea.jornada)))

  const handleDownload = () => {
    const dataToExport = filteredLineas.map((linea) => ({
      Fecha: new Date(linea.fecha).toLocaleDateString(),
      Conductor: linea.conductor,
      Transportista: linea.transportista,
      Vehículo: linea.vehiculo,
      Cliente: linea.cliente,
      "Lugar de Carga": linea.lugarCarga,
      "Lugar de Descarga": linea.lugarDescarga,
      Espera: linea.espera,
      Trabajo: linea.trabajo,
      Toneladas: linea.toneladas,
      Material: linea.material,
      Estado: linea.estado,
    }))
    generateExcel(dataToExport, "lineas_de_trabajo.xlsx")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Líneas</h1>

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
          <Select value={filtroCliente} onValueChange={setFiltroCliente}>
            <SelectTrigger className="w-40 border-[#dadada]">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {clientesUnicos.map((cliente) => (
                <SelectItem key={cliente} value={cliente}>
                  {cliente}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroJornada} onValueChange={setFiltroJornada}>
            <SelectTrigger className="w-40 border-[#dadada]">
              <SelectValue placeholder="Jornada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {jornadasUnicas.map((jornada) => (
                <SelectItem key={jornada} value={jornada}>
                  {jornada}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
              
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
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 border-[#dadada]"
              placeholder="Buscar..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-[#dadada]" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dadada] overflow-hidden">
        <Table>
          <DataTableHeader headers={LINEAS_TABLE_HEADERS} />
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
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
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredLineas.map((linea) => (
                  <TableRow key={linea._id}>
                    <TableCell>{new Date(linea.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{linea.conductor}</TableCell>
                    <TableCell>{linea.transportista}</TableCell>
                    <TableCell>{linea.vehiculo}</TableCell>
                    <TableCell>{linea.cliente}</TableCell>
                    <TableCell>{linea.lugarCarga}</TableCell>
                    <TableCell>{linea.lugarDescarga}</TableCell>
                    <TableCell>{linea.espera}</TableCell>
                    <TableCell>{linea.trabajo}</TableCell>
                    <TableCell>{linea.toneladas}</TableCell>
                    <TableCell>{linea.material}</TableCell>
                    <TableCell>{linea.jornada}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          linea.estado === "Pendiente" ? "bg-[#ffa100] text-white" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {linea.estado}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

