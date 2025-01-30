import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cliente from "@/models/Cliente"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const cliente = await Cliente.create(body)
    return NextResponse.json(cliente, { status: 201 })
  } catch (error: any) {
    console.error("Error al crear el cliente:", error)
    if (error.code === 11000 || error.message.includes("Ya existe un cliente con este nombre")) {
      return NextResponse.json({ error: "Ya existe un cliente con este nombre" }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Error al crear el cliente" }, { status: 400 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const clientes = await Cliente.find({}).sort({ nombre: 1 })
    return NextResponse.json(clientes)
  } catch (error: any) {
    console.error("Error al obtener los clientes:", error)
    return NextResponse.json({ error: error.message || "Error al obtener los clientes" }, { status: 500 })
  }
}

