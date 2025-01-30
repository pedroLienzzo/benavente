import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cliente from "@/models/Cliente"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    const updatedCliente = await Cliente.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updatedCliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }
    return NextResponse.json(updatedCliente)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar el cliente" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedCliente = await Cliente.findByIdAndDelete(id)
    if (!deletedCliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ message: "Cliente eliminado correctamente" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar el cliente" }, { status: 400 })
  }
}

