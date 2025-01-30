export interface LineaParte {
  cliente: string
  lugarCarga: string
  lugarDescarga: string
  espera: string
  trabajo: string
  toneladas: number
  material: string
}

export interface ParteTrabajo {
  fecha: string
  matricula: string
  kilometros: number
  conductor: string
  transportista: string
  jornada: string
  estado: "Pendiente" | "Completado"
  lineas: LineaParte[]
}

