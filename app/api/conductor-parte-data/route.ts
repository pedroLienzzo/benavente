import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"
import Transportista from "@/models/Transportista"
import Cliente from "@/models/Cliente"
import Material from "@/models/Material"
import { authOptions } from "@/app/api/auth/[...nextauth]/config"

export async function GET() {
  try {
    console.log("1. Starting API request")
    const session = await getServerSession(authOptions)
    console.log("2. Session in API:", session)

    if (!session) {
      console.log("3a. No session found")
      return NextResponse.json({ error: "No autorizado - No session" }, { status: 401 })
    }

    await dbConnect()
    const [vehiculos, transportistas, clientes, materiales] = await Promise.all([
      Vehiculo.find({}).sort({ matricula: 1 }).lean(),
      Transportista.find({}).sort({ nombre: 1 }).lean(),
      Cliente.find({}).sort({ nombre: 1 }).lean(),
      Material.find({}).sort({ nombre: 1 }).lean(),
    ])

    return NextResponse.json({
      vehiculos,
      transportistas,
      clientes,
      materiales,
    })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}