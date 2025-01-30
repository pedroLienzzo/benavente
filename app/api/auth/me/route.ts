import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { findUserById } from "@/lib/db"

export async function GET() {
  try {
    const authToken = cookies().get("auth_token")

    if (!authToken) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET!) as { id: string }

    // Get user data
    const user = await findUserById(decoded.id)
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }
}

