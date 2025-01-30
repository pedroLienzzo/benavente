import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"
import Transportista from "@/models/Transportista"

export async function GET() {
  try {
    await dbConnect()
    const [vehiculos, transportistas] = await Promise.all([
      Vehiculo.find({}).sort({ matricula: 1 }).lean(),
      Transportista.find({}).sort({ nombre: 1 }).lean(),
    ])

    console.log("Vehículos obtenidos:", vehiculos)
    console.log("Transportistas obtenidos:", transportistas)

    return NextResponse.json({
      vehiculos,
      transportistas,
    })
  } catch (error: any) {
    console.error("Error al obtener los datos para el conductor:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener los datos para el conductor" },
      { status: 500 },
    )
  }
}

