import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Conductor from "@/models/Conductor"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()
    const authToken = cookies().get("conductor_auth_token")

    if (!authToken) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET!) as { id: string }

    // Get conductor data
    const conductor = await Conductor.findById(decoded.id).select("-contraseña")
    if (!conductor) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 401 })
    }

    return NextResponse.json(conductor)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
}

