import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Conductor from "@/models/Conductor"
import Vehiculo from "@/models/Vehiculo"
import Transportista from "@/models/Transportista"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()

    // Verificar si la matrícula existe
    const vehiculo = await Vehiculo.findOne({ matricula: body.matriculaAsignada })
    if (!vehiculo) {
      return NextResponse.json({ error: "La matrícula asignada no existe" }, { status: 400 })
    }

    // Verificar si el transportista existe
    const transportista = await Transportista.findOne({ nombre: body.transportistaAsociado })
    if (!transportista) {
      return NextResponse.json({ error: "El transportista asociado no existe" }, { status: 400 })
    }

    const conductor = await Conductor.create(body)
    const { contraseña, ...conductorSinContraseña } = conductor.toObject()
    return NextResponse.json(conductorSinContraseña, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "El correo electrónico ya está en uso" }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Error al crear el conductor" }, { status: 400 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const conductores = await Conductor.find({}).sort({ createdAt: -1 })
    return NextResponse.json(conductores)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener los conductores" }, { status: 500 })
  }
}

