"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Clock, X } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineaParte, ParteTrabajo, ParteData } from "@/types/parte"

interface ParteFormProps {
  initialData?: ParteTrabajo | null
  onSubmit: (parte: ParteTrabajo) => Promise<void>
  backUrl: string
  title: string
  showConductorSelect?: boolean
  defaultConductor?: string
  isEditing?: boolean
  initialParteData?: ParteData
}

export function ParteForm({
  initialData,
  onSubmit,
  backUrl,
  title,
  showConductorSelect = true,
  defaultConductor,
  isEditing = false,
  initialParteData
}: ParteFormProps) {
  const [error, setError] = useState<string | string[]>("")
  const [parteData, setParteData] = useState<ParteData>(initialParteData || {
    conductores: [],
    transportistas: [],
    vehiculos: [],
    clientes: [],
    materiales: [],
  })
  const [parte, setParte] = useState<ParteTrabajo>(
    initialData || {
      fecha: "",
      matricula: "",
      kilometros: 0,
      conductor: defaultConductor || "",
      transportista: "",
      estado: "Pendiente",
      lineas: [{
        cliente: "",
        lugarCarga: "",
        lugarDescarga: "",
        espera: "",
        trabajo: "",
        toneladas: 0,
        material: "",
        jornada: "",
      }]
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target

    if (typeof index === "number") {
      const newLineas = [...parte.lineas]
      newLineas[index] = {
        ...newLineas[index],
        [name]: name === "toneladas" ? Number(value) : value,
      }
      setParte({ ...parte, lineas: newLineas })
    } else {
      setParte({
        ...parte,
        [name]: name === "kilometros" ? Number(value) : value,
      })
    }
    setError("")
  }

  const handleSelectChange = (value: string, field: string, index?: number) => {
    if (typeof index === "number") {
      const newLineas = [...parte.lineas]
      newLineas[index] = {
        ...newLineas[index],
        [field]: value,
      }
      setParte({ ...parte, lineas: newLineas })
    } else {
      setParte({ ...parte, [field]: value })
    }
    setError("")
  }

  const addLinea = () => {
    setParte({
      ...parte,
      lineas: [
        ...parte.lineas,
        {
          cliente: "",
          lugarCarga: "",
          lugarDescarga: "",
          espera: "",
          trabajo: "",
          toneladas: 0,
          material: "",
          jornada: "",
        },
      ],
    })
  }

  const removeLinea = (indexToRemove: number) => {
    if (parte.lineas.length <= 1) {
      setError("Debe haber al menos una línea en el parte")
      return
    }
    setParte({
      ...parte,
      lineas: parte.lineas.filter((_, index) => index !== indexToRemove),
    })
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!parte.fecha) errors.push("Por favor, seleccione una fecha")
    if (!parte.matricula) errors.push("Por favor, seleccione una matrícula")
    if (showConductorSelect && !parte.conductor) errors.push("Por favor, seleccione un conductor")
    if (!parte.transportista) errors.push("Por favor, seleccione un transportista")

    parte.lineas.forEach((linea, index) => {
      if (!linea.cliente) errors.push(`Línea ${index + 1}: Por favor, seleccione un cliente`)
      if (!linea.lugarCarga) errors.push(`Línea ${index + 1}: Por favor, ingrese un lugar de carga`)
      if (!linea.lugarDescarga) errors.push(`Línea ${index + 1}: Por favor, ingrese un lugar de descarga`)
      if (!linea.espera) errors.push(`Línea ${index + 1}: Por favor, ingrese el tiempo de espera`)
      if (!linea.trabajo) errors.push(`Línea ${index + 1}: Por favor, ingrese el tiempo de trabajo`)
      if (!linea.material) errors.push(`Línea ${index + 1}: Por favor, seleccione el material`)
      if (!linea.jornada) errors.push(`Línea ${index + 1}: Por favor, seleccione un tipo de jornada`)
    })

    return errors
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()

    if (errors.length > 0) {
      setError(errors)
      return
    }

    try {
      await onSubmit(parte)
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error al procesar el parte de trabajo")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href={backUrl} className="flex items-center text-[#626262] hover:text-[#000000]">
            <ChevronLeft className="w-5 h-5 mr-1" />
            {title}
          </Link>
          {isEditing && (
            <Select value={parte.estado} onValueChange={(value) => handleSelectChange(value, "estado")}>
              <SelectTrigger className="w-32 bg-[#ffa100] text-white border-0">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <Button onClick={handleFormSubmit} className="bg-[#002fff] hover:bg-[#002fff]/90 text-white rounded-full px-8">
          {isEditing ? "Guardar" : "Crear"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {Array.isArray(error) ? (
              <ul className="list-disc pl-4">
                {error.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            ) : (
              error
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#dadada] p-6">
          <h2 className="text-[#002fff] font-medium mb-6">Información</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <label htmlFor="fecha" className="text-sm text-gray-600">
                Fecha
              </label>
              <Input
                id="fecha"
                type="date"
                name="fecha"
                value={parte.fecha}
                onChange={handleInputChange}
                className="border-[#dadada]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Matrícula
              </label>
              <Select value={parte?.matricula} onValueChange={(value) => handleSelectChange(value, "matricula")}>
                <SelectTrigger className="border-[#dadada]">
                  <SelectValue placeholder="Seleccionar matrícula" />
                </SelectTrigger>
                <SelectContent>
                  {parteData.vehiculos.map((vehiculo) => (
                    <SelectItem key={vehiculo._id} value={vehiculo.matricula}>
                      {vehiculo.matricula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="kilometros" className="text-sm text-gray-600">
                Kilómetros
              </label>
              <Input
                id="kilometros"
                type="number"
                name="kilometros"
                placeholder="Introducir kms"
                value={parte.kilometros}
                onChange={handleInputChange}
                className="border-[#dadada]"
                required
              />
            </div>
            {showConductorSelect ? (
              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Conductor
                </label>
                <Select value={parte.conductor} onValueChange={(value) => handleSelectChange(value, "conductor")}>
                  <SelectTrigger className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar conductor" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteData.conductores.map((conductor) => (
                      <SelectItem key={conductor._id} value={conductor.nombre}>
                        {conductor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Transportista
              </label>
              <Select value={parte.transportista} onValueChange={(value) => handleSelectChange(value, "transportista")}>
                <SelectTrigger className="border-[#dadada]">
                  <SelectValue placeholder="Seleccionar transportista" />
                </SelectTrigger>
                <SelectContent>
                  {parteData.transportistas.map((transportista) => (
                    <SelectItem key={transportista._id} value={transportista.nombre}>
                      {transportista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {parte.lineas.map((linea, index) => (
          <div key={index} className="bg-white rounded-xl border border-[#dadada] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#002fff] font-medium">Línea {index + 1}</h2>
              <Button
                type="button"
                onClick={() => removeLinea(index)}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" /> Eliminar línea
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Cliente
                </label>
                <Select value={linea.cliente} onValueChange={(value) => handleSelectChange(value, "cliente", index)}>
                  <SelectTrigger className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteData.clientes.map((cliente) => (
                      <SelectItem key={cliente._id} value={cliente.nombre}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor={`lugarCarga-${index}`} className="text-sm text-gray-600">
                  Lugar de carga
                </label>
                <Input
                  id={`lugarCarga-${index}`}
                  name="lugarCarga"
                  placeholder="Introducir lugar"
                  value={linea.lugarCarga}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border-[#dadada]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`lugarDescarga-${index}`} className="text-sm text-gray-600">
                  Lugar de descarga
                </label>
                <Input
                  id={`lugarDescarga-${index}`}
                  name="lugarDescarga"
                  placeholder="Introducir lugar"
                  value={linea.lugarDescarga}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border-[#dadada]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`espera-${index}`} className="text-sm text-gray-600">
                  Tiempo de espera
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id={`espera-${index}`}
                    name="espera"
                    placeholder="HH:MM"
                    value={linea.espera}
                    onChange={(e) => handleInputChange(e, index)}
                    className="border-[#dadada] pr-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor={`trabajo-${index}`} className="text-sm text-gray-600">
                  Tiempo de trabajo
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id={`trabajo-${index}`}
                    name="trabajo"
                    placeholder="HH:MM"
                    value={linea.trabajo}
                    onChange={(e) => handleInputChange(e, index)}
                    className="border-[#dadada] pr-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor={`toneladas-${index}`} className="text-sm text-gray-600">
                  Toneladas
                </label>
                <Input
                  id={`toneladas-${index}`}
                  name="toneladas"
                  type="number"
                  placeholder="Tm."
                  value={linea.toneladas}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border-[#dadada]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Material
                </label>
                <Select value={linea.material} onValueChange={(value) => handleSelectChange(value, "material", index)}>
                  <SelectTrigger className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteData.materiales.map((material) => (
                      <SelectItem key={material._id} value={material.nombre}>
                        {material.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Jornada
                </label>
                <Select value={linea.jornada} onValueChange={(value) => handleSelectChange(value, "jornada", index)}>
                  <SelectTrigger className="border-[#dadada]">
                    <SelectValue placeholder="Seleccionar jornada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manana">Mañana</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noche">Noche</SelectItem>
                    <SelectItem value="completa">Completa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={addLinea}
          variant="outline"
          className="bg-[#002fff]/10 text-[#002fff] border-0 rounded-full"
        >
          + Añadir línea
        </Button>
      </form>
    </div>
  )
} 