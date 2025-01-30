interface Linea {
  _id: string
  parteId: string
  fecha: string
  conductor: string
  transportista: string
  vehiculo: string
  cliente: string
  lugarCarga: string
  lugarDescarga: string
  espera: string
  trabajo: string
  toneladas: number
  material: string
  estado: "Pendiente" | "Completado"
}

export type { Linea } 