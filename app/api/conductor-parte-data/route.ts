import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"
import Transportista from "@/models/Transportista"
import Cliente from "@/models/Cliente"
import Material from "@/models/Material"
import Conductor from "@/models/Conductor"
import Jornada from "@/models/Jornada"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    // console.log("1. Starting API request")
    const session = await getServerSession(authOptions)
    // console.log("2. Session in API:", session)

    if (!session) {
      // console.log("3a. No session found")
      return NextResponse.json({ error: "No autorizado - No session" }, { status: 401 })
    }

    await dbConnect()
    
    // Corrected Promise.all with proper collection queries
    const [conductores, vehiculos, transportistas, clientes, materiales, jornadas] = await Promise.all([
      Conductor.find({}).sort({ nombre: 1 }).lean(), // Conductores collection
      Vehiculo.find({}).sort({ matricula: 1 }).lean(), // Vehiculos collection (with matricula)
      Transportista.find({}).sort({ nombre: 1 }).lean(), // Transportistas collection
      Cliente.find({}).sort({ nombre: 1 }).lean(), // Clientes collection
      Material.find({}).sort({ nombre: 1 }).lean(), // Materiales collection
      Jornada.find({}).sort({ nombre: 1 }).lean(), // Jornadas collection
    ])

    return NextResponse.json({
      conductores: conductores.map(c => ({
        _id: c._id,
        nombre: c.nombre,
        matricula: c.matriculaAsignada,
        transportista: c.transportistaAsociado
      })),
      vehiculos: vehiculos.map(v => ({
        _id: v._id,
        matricula: v.matricula
      })),
      transportistas: transportistas.map(t => ({
        _id: t._id,
        nombre: t.nombre
      })),
      clientes: clientes.map(c => ({
        _id: c._id,
        nombre: c.nombre
      })),
      materiales: materiales.map(m => ({
        _id: m._id,
        nombre: m.nombre
      })),
      jornadas: jornadas.map(j => ({
        _id: j._id,
        nombre: j.nombre
      }))
    })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}