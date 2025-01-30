import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transportista from "@/models/Transportista"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const transportista = await Transportista.create(body)
    return NextResponse.json(transportista, { status: 201 })
  } catch (error: any) {
    console.error("Error al crear el transportista:", error)
    if (error.code === 11000 || error.message.includes("Ya existe un transportista con este nombre")) {
      return NextResponse.json({ error: "Ya existe un transportista con este nombre" }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Error al crear el transportista" }, { status: 400 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const transportistas = await Transportista.find({}).sort({ nombre: 1 })
    return NextResponse.json(transportistas)
  } catch (error: any) {
    console.error("Error al obtener los transportistas:", error)
    return NextResponse.json({ error: error.message || "Error al obtener los transportistas" }, { status: 500 })
  }
}

