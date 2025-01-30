import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user.toObject()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" })

    // Set auth token cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    // Set user data cookie for client-side access
    cookies().set("user", JSON.stringify(userWithoutPassword), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}

