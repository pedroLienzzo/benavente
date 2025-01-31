import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongodb"
import ParteTrabajo from "@/models/ParteTrabajo"
import { GET as authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.type !== "conductor") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    // Get partes for this conductor
    const partes = await ParteTrabajo.find({ 
      conductor: session.user.name 
    }).sort({ createdAt: -1 }).lean()

    return NextResponse.json(partes)
  } catch (error) {
    console.error("Error al obtener los partes del conductor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

