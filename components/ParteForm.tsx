"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Clock, X } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ParteTrabajo, ParteData } from "@/types/parte"
import { useSession } from "next-auth/react"

interface ParteFormProps {
  initialData?: ParteTrabajo | null
  onSubmit: (parte: ParteTrabajo) => Promise<void>
  backUrl: string
  title: string
  isEditing?: boolean
  initialParteData?: ParteData
  userType: 'admin' | 'conductor'
  defaultValues?: {
    conductor?: string
    matricula?: string
    transportista?: string
  }
}

export function ParteForm({
  initialData,
  onSubmit,
  backUrl,
  title,
  isEditing = false,
  initialParteData,
  userType,
}: ParteFormProps) {
  const { data: session } = useSession()
  const [error, setError] = useState<string | string[]>("")
  const [parteData, setParteData] = useState<ParteData>(initialParteData || {
    conductores: [],
    transportistas: [],
    vehiculos: [],
    clientes: [],
    materiales: [],
  })
  const [errorFields, setErrorFields] = useState<{ [key: string]: boolean }>({})

  // Initialize parte with either initialData or default values
  const [parte, setParte] = useState<ParteTrabajo>(() => {
    if (initialData) return initialData

    // Only use session data for new partes from conductor
    if (userType === 'conductor' && session?.user) {
      return {
        fecha: new Date().toISOString().split("T")[0],
        matricula: session.user.vehiculo || "",
        kilometros: 0,
        conductor: session.user.name || "",
        transportista: session.user.transportista || "",
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
    }

    // Default empty parte for admin
    return {
      fecha: new Date().toISOString().split("T")[0],
      matricula: "",
      kilometros: 0,
      conductor: "",
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
  })

  // Fetch data only if we're in admin mode or editing
  useEffect(() => {
    if (userType === 'conductor' && !isEditing) return

    const fetchData = async () => {
      try {
        const res = await fetch("/api/conductor-parte-data")
        if (!res.ok) throw new Error("Error al obtener los datos")
        const data = await res.json()
        setParteData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [userType, isEditing])

  // Remove the session effect that was overwriting the state
  // useEffect(() => {
  //   console.log("Current parte state:", parte)
  //   console.log("Current session:", session)
  // }, [parte, session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === "espera" || name === "trabajo") {
      const { name, value } = e.target;

      // Allow users to type colons
      let displayValue = value;

      // Auto-insert colon after two digits if not already present
      if (value.length === 2 && !value.includes(':')) {
        displayValue = `${value}:`;
      }

      // Update state with display value
      if (typeof index === 'number') {
        const newLineas = [...parte.lineas];
        newLineas[index] = { ...newLineas[index], [name]: displayValue };
        setParte({ ...parte, lineas: newLineas });
      } else {
        setParte({ ...parte, [name]: displayValue });
      }
    } else if (name === "kilometros" || name === "toneladas") {
      const numericValue = Number(value);
      if (numericValue > 0) {
        if (typeof index === "number") {
          const newLineas = [...parte.lineas];
          newLineas[index] = {
            ...newLineas[index],
            [name]: numericValue,
          };
          setParte({ ...parte, lineas: newLineas });
        } else {
          setParte({
            ...parte,
            [name]: numericValue,
          });
        }
      }
    } else {
      if (typeof index === "number") {
        const newLineas = [...parte.lineas];
        newLineas[index] = {
          ...newLineas[index],
          [name]: name === "toneladas" ? Number(value) : value,
        };
        setParte({ ...parte, lineas: newLineas });
      } else {
        setParte({
          ...parte,
          [name]: name === "kilometros" ? Number(value) : value,
        });
      }
    }
    setError("");
  };

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
    const newErrorFields: { [key: string]: boolean } = {}

    if (!parte.fecha) {
      errors.push("Por favor, seleccione una fecha")
      newErrorFields.fecha = true
    }
    if (!parte.matricula) {
      errors.push("Por favor, seleccione una matrícula")
      newErrorFields.matricula = true
    }
    // Validate "Kilómetros" and "Toneladas"
    if (parte.kilometros <= 0) {
      errors.push(`Kilómetros debe ser mayor que 0`)
      newErrorFields.kilometros = true
    }
    if (!parte.conductor) {
      errors.push("Por favor, seleccione un conductor")
      newErrorFields.conductor = true
    }
    if (!parte.transportista) {
      errors.push("Por favor, seleccione un transportista")
      newErrorFields.transportista = true
    }

    parte.lineas.forEach((linea, index) => {
      if (!linea.cliente) {
        errors.push(`Línea ${index + 1}: Por favor, seleccione un cliente`)
        newErrorFields[`cliente-${index}`] = true
      }
      if (!linea.lugarCarga) {
        errors.push(`Línea ${index + 1}: Por favor, ingrese un lugar de carga`)
        newErrorFields[`lugarCarga-${index}`] = true
      }
      if (!linea.lugarDescarga) {
        errors.push(`Línea ${index + 1}: Por favor, ingrese un lugar de descarga`)
        newErrorFields[`lugarDescarga-${index}`] = true
      }

      // Validate "Tiempo de espera"
      if (!linea.espera || !/^\d{1,2}:\d{2}$/.test(linea.espera)) {
        errors.push(`Línea ${index + 1}: Por favor, ingrese un tiempo de espera válido (HH:MM)`)
        newErrorFields[`espera-${index}`] = true
      }

      // Validate "Tiempo de trabajo"
      if (!linea.trabajo || !/^\d{1,2}:\d{2}$/.test(linea.trabajo)) {
        errors.push(`Línea ${index + 1}: Por favor, ingrese un tiempo de trabajo válido (HH:MM)`)
        newErrorFields[`trabajo-${index}`] = true
      }

      if (linea.toneladas <= 0) {
        errors.push(`Línea ${index + 1}: Toneladas debe ser mayor que 0`)
        newErrorFields[`toneladas-${index}`] = true
      }

      if (!linea.material) {
        errors.push(`Línea ${index + 1}: Por favor, seleccione el material`)
        newErrorFields[`material-${index}`] = true
      }
      if (!linea.jornada) {
        errors.push(`Línea ${index + 1}: Por favor, seleccione un tipo de jornada`)
        newErrorFields[`jornada-${index}`] = true
      }
    })

    setErrorFields(newErrorFields)
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

  // Render function for our submit button.
  const renderSubmitButton = () => (
    <Button
      onClick={handleFormSubmit}
      className="bg-[#002fff] hover:bg-[#002fff]/90 text-white rounded-full px-8"
    >
      {isEditing ? "Guardar" : "Crear"}
    </Button>
  )

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex justify-between sm:justify-start space-x-4 w-full">
          <Link href={backUrl} className="flex items-center text-[#626262] hover:text-[#000000]">
            <ChevronLeft className="w-5 h-5 mr-1" />
            {title}
          </Link>
          {isEditing && userType !== 'conductor' ? (
            <Select
              value={parte.estado}
              onValueChange={(value) => handleSelectChange(value, "estado")}
            >
              <SelectTrigger className={`w-32 ${parte.estado === "Pendiente" ? "bg-[#ffa100] text-white" : "bg-green-100 text-green-800"} border-0`}>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={parte.estado}
              onValueChange={(value) => handleSelectChange(value, "estado")}
              disabled={userType === 'conductor'}
            >
              <SelectTrigger className={`w-32 bg-[#ffa100] text-white border-0`}>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        {/* Desktop-only button (visible on medium screens and up) */}
        <div className="hidden md:flex">
          {renderSubmitButton()}
        </div>
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
        <div className="bg-white rounded-xl border border-[#dadada] p-4 sm:p-6">
          <h2 className="text-[#002fff] font-medium mb-6">Información</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                className={`border-[#dadada] ${errorFields.fecha ? "border-red-500" : ""}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Matrícula
              </label>
              <Select value={parte.matricula} onValueChange={(value) => handleSelectChange(value, "matricula")}>
                <SelectTrigger className={`border-[#dadada] ${errorFields.matricula ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar matrícula" />
                </SelectTrigger>
                <SelectContent>
                  {parteData?.vehiculos?.map((vehiculo) => (
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
                className={`border-[#dadada] ${errorFields.kilometros ? "border-red-500" : ""}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Conductor
              </label>
              <Select
                value={parte.conductor}
                onValueChange={(value) => handleSelectChange(value, "conductor")}
                disabled={userType === 'conductor'}
              >
                <SelectTrigger className={`border-[#dadada] ${errorFields.conductor ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar conductor" />
                </SelectTrigger>
                <SelectContent>
                  {parteData?.conductores?.map((conductor) => (
                    <SelectItem key={conductor._id} value={conductor.nombre}>
                      {conductor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Transportista
              </label>
              <Select value={parte.transportista} onValueChange={(value) => handleSelectChange(value, "transportista")}>
                <SelectTrigger className={`border-[#dadada] ${errorFields.transportista ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar transportista" />
                </SelectTrigger>
                <SelectContent>
                  {parteData?.transportistas?.map((transportista) => (
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
          <div key={index} className="bg-white rounded-xl border border-[#dadada] p-4 sm:p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Cliente
                </label>
                <Select
                  value={linea.cliente}
                  onValueChange={(value) => handleSelectChange(value, "cliente", index)}
                >
                  <SelectTrigger className={`border-[#dadada] ${errorFields[`cliente-${index}`] ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteData?.clientes?.map((cliente) => (
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
                  className={`border-[#dadada] ${errorFields[`lugarCarga-${index}`] ? "border-red-500" : ""}`}
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
                  className={`border-[#dadada] ${errorFields[`lugarDescarga-${index}`] ? "border-red-500" : ""}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`espera-${index}`} className="text-sm text-gray-600">
                  Tiempo de espera
                </label>
                <Input
                  id={`espera-${index}`}
                  name="espera"
                  placeholder="HH:MM"
                  type="time"
                  value={linea.espera}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`border-[#dadada] ${errorFields[`espera-${index}`] ? "border-red-500" : ""}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`trabajo-${index}`} className="text-sm text-gray-600">
                  Tiempo de trabajo
                </label>
                <Input
                  id={`trabajo-${index}`}
                  name="trabajo"
                  type="time"
                  placeholder="HH:MM"
                  value={linea.trabajo}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`border-[#dadada] ${errorFields[`trabajo-${index}`] ? "border-red-500" : ""}`}
                  required
                />
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
                  className={`border-[#dadada] ${errorFields[`toneladas-${index}`] ? "border-red-500" : ""}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Material
                </label>
                <Select value={linea.material} onValueChange={(value) => handleSelectChange(value, "material", index)}>
                  <SelectTrigger className={`border-[#dadada] ${errorFields[`material-${index}`] ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {parteData?.materiales?.map((material) => (
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
                  <SelectTrigger className={`border-[#dadada] ${errorFields[`jornada-${index}`] ? "border-red-500" : ""}`}>
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
          className="w-full sm:w-auto bg-[#002fff]/10 text-[#002fff] border-0 rounded-full"
        >
          + Añadir línea
        </Button>
      </form>

      {/* Mobile-only button (visible on small screens) */}
      <div className="flex md:hidden mt-6 justify-center">
        {renderSubmitButton()}
      </div>
    </div>
  )
}