import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Material from "@/models/Material"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    const updatedMaterial = await Material.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updatedMaterial) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }
    return NextResponse.json(updatedMaterial)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar el material" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedMaterial = await Material.findByIdAndDelete(id)
    if (!deletedMaterial) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ message: "Material eliminado correctamente" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar el material" }, { status: 400 })
  }
}

