import { NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    // Create new user
    const user = await createUser({ name, email, password })

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user

    // Set a cookie to maintain the session
    cookies().set("auth", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof Error && "errors" in error) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Error de validación", details: validationErrors }, { status: 400 })
    }
    return NextResponse.json({ error: "Error en el registro" }, { status: 500 })
  }
}

