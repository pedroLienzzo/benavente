import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Conductor from "@/models/Conductor"
import Transportista from "@/models/Transportista"
import Vehiculo from "@/models/Vehiculo"
import Cliente from "@/models/Cliente"
import Material from "@/models/Material"
import Jornada from "@/models/Jornada"

export async function GET() {
  try {
    await dbConnect()
    const [conductores, transportistas, jornadas, vehiculos, clientes, materiales] = await Promise.all([
      Conductor.find({}).sort({ nombre: 1 }).lean(),
      Transportista.find({}).sort({ nombre: 1 }).lean(),
      Jornada.find({}).sort({ nombre: 1 }).lean(),  
      Vehiculo.find({}).sort({ matricula: 1 }).lean(),
      Cliente.find({}).sort({ nombre: 1 }).lean(),
      Material.find({}).sort({ nombre: 1 }).lean(),
    ])

    return NextResponse.json({
      conductores,
      transportistas,
      jornadas,
      vehiculos,
      clientes,
      materiales,
    })
  } catch (error: any) {
    console.error("Error al obtener los datos para el parte:", error)
    return NextResponse.json({ error: error.message || "Error al obtener los datos para el parte" }, { status: 500 })
  }
}

