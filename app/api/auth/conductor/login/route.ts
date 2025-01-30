import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Conductor from "@/models/Conductor"
import dbConnect from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { correo, contraseña } = body

    // Find conductor by email
    const conductor = await Conductor.findOne({ correo }).select("+contraseña")
    if (!conductor) {
      console.log("Conductor no encontrado:", correo)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Check password
    const isMatch = await conductor.matchPassword(contraseña)
    if (!isMatch) {
      console.log("Contraseña incorrecta para:", correo)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Remove password from the response
    const conductorWithoutPassword = conductor.toObject()
    delete conductorWithoutPassword.contraseña

    // Generate JWT token
    const token = jwt.sign({ id: conductor._id }, process.env.JWT_SECRET!, { expiresIn: "30d" })

    // Set auth token cookie
    cookies().set("conductor_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    // Set conductor data cookie for client-side access
    cookies().set("conductor", JSON.stringify(conductorWithoutPassword), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    console.log("Login exitoso para conductor:", correo)
    return NextResponse.json(conductorWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}

