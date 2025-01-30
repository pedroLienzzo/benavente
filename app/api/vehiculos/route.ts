import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const vehiculo = await Vehiculo.create({ matricula: body.matricula })
    return NextResponse.json(vehiculo, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear el vehículo" }, { status: 400 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const vehiculos = await Vehiculo.find({}).sort({ matricula: 1 })
    return NextResponse.json(vehiculos)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener los vehículos" }, { status: 500 })
  }
}

