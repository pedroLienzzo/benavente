import { NextResponse } from "next/server"
import { getPartesTrabajo } from "@/lib/db"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()
    const partes = await getPartesTrabajo()
    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a MongoDB usando Mongoose",
      data: { count: partes.length, sample: partes.slice(0, 3) },
    })
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al conectar con MongoDB: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}

