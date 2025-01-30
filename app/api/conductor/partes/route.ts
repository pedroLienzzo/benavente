import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Conductor from "@/models/Conductor"
import { ParteTrabajo } from "@/schemas/ParteTrabajoSchema"

export async function GET() {
  try {
    await dbConnect()

    // Get conductor from token
    const conductorAuthToken = cookies().get("conductor_auth_token")
    if (!conductorAuthToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = jwt.verify(conductorAuthToken.value, process.env.JWT_SECRET!) as { id: string }
    const conductor = await Conductor.findById(decoded.id)
    if (!conductor) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 401 })
    }

    // Get partes for this conductor
    const partes = await ParteTrabajo.find({ conductor: conductor.nombre }).sort({ createdAt: -1 }).lean()

    return NextResponse.json(partes)
  } catch (error) {
    console.error("Error al obtener los partes del conductor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

