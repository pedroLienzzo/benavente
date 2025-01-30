import { NextResponse } from "next/server"
import { getPartesTrabajo, createParteTrabajo } from "@/lib/db"
import type { ParteTrabajo } from "@/types/parteTrabajo"

export async function GET() {
  try {
    const partes = await getPartesTrabajo()
    // console.log("API: Fetched partes:", partes)
    return NextResponse.json(partes)
  } catch (error) {
    // console.error("API: Error fetching partes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data: ParteTrabajo = await request.json()
    // console.log("API: Received parte data:", data)
    const parte = await createParteTrabajo(data)
    // console.log("API: Created parte:", parte)
    return NextResponse.json(parte)
  } catch (error) {
    // console.error("API: Error creating parte:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

