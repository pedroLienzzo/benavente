import { NextResponse } from "next/server"
import { getPartesTrabajo, createParteTrabajo } from "@/lib/db"
import type { ParteTrabajo } from "@/types/parteTrabajo"

export async function GET() {
  try {
    const partes = await getPartesTrabajo()
    // console.log("API: Fetched partes:", partes)
    return NextResponse.json(partes)
  } catch (error) {
    console.error("API: Error fetching partes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // console.log("API: Received raw data:", JSON.stringify(data, null, 2))

    // Validate required fields before creating
    if (!data.fecha) throw new Error("Fecha is required")
    if (!data.matricula) throw new Error("Matricula is required")
    if (!data.kilometros) throw new Error("Kilometros is required")
    if (!data.conductor) throw new Error("Conductor is required")
    if (!data.transportista) throw new Error("Transportista is required")
    
    // Format the date properly
    data.fecha = new Date(data.fecha)

    // Ensure numeric fields are numbers
    data.kilometros = Number(data.kilometros)
    if (data.lineas) {
      data.lineas = data.lineas.map((linea: any) => ({
        ...linea,
        toneladas: Number(linea.toneladas)
      }))
    }

    // console.log("API: Processed data before creation:", JSON.stringify(data, null, 2))
    
    const parte = await createParteTrabajo(data)
    // console.log("API: Successfully created parte:", JSON.stringify(parte, null, 2))
    
    return NextResponse.json(parte)
  } catch (error: any) {
    console.error("API: Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { 
        error: error.message || "Error interno del servidor",
        details: error.stack
      }, 
      { status: 500 }
    )
  }
}


