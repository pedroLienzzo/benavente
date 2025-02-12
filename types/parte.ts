interface LineaParte {
  cliente: string
  lugarCarga: string
  lugarDescarga: string
  espera: string
  trabajo: string
  toneladas: number
  material: string
  jornada: string
}

interface ParteTrabajo {
  _id?: string
  fecha: string
  matricula: string
  kilometros: number
  conductor: string
  transportista: string
  estado: "Pendiente" | "Completado"
  lineas: LineaParte[]
}

interface ParteData {
  conductores?: { _id: string; nombre: string }[]
  transportistas: { _id: string; nombre: string }[]
  vehiculos: { _id: string; matricula: string }[]
  clientes: { _id: string; nombre: string }[]
  materiales: { _id: string; nombre: string }[]
  jornadas: { _id: string; nombre: string }[]
}

export type { LineaParte, ParteTrabajo, ParteData } 