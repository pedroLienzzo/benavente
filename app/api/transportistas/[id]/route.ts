import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transportista from "@/models/Transportista"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    const updatedTransportista = await Transportista.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updatedTransportista) {
      return NextResponse.json({ error: "Transportista no encontrado" }, { status: 404 })
    }
    return NextResponse.json(updatedTransportista)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar el transportista" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedTransportista = await Transportista.findByIdAndDelete(id)
    if (!deletedTransportista) {
      return NextResponse.json({ error: "Transportista no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ message: "Transportista eliminado correctamente" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar el transportista" }, { status: 400 })
  }
}

