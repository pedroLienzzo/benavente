import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Material from "@/models/Material"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const material = await Material.create({ nombre: body.nombre })
    return NextResponse.json(material, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear el material" }, { status: 400 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const materiales = await Material.find({}).sort({ nombre: 1 })
    return NextResponse.json(materiales)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener los materiales" }, { status: 500 })
  }
}

