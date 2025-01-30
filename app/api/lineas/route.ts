import { NextResponse } from "next/server"
import { getAllLineas } from "@/lib/db"

export async function GET() {
  try {
    const lineas = await getAllLineas()
    console.log("API: Fetched lineas:", lineas)
    return NextResponse.json(lineas)
  } catch (error) {
    console.error("API: Error fetching lineas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

