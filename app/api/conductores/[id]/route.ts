import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Conductor from "@/models/Conductor"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()

    // Si se está actualizando la contraseña, asegúrate de que tenga al menos 8 caracteres
    if (body.contraseña && body.contraseña.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
    }

    const updatedConductor = await Conductor.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updatedConductor) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 })
    }
    const conductorSinContraseña = updatedConductor.toObject()
    delete conductorSinContraseña.contraseña
    return NextResponse.json(conductorSinContraseña)
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "El correo electrónico ya está en uso" }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || "Error al actualizar el conductor" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedConductor = await Conductor.findByIdAndDelete(id)
    if (!deletedConductor) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ message: "Conductor eliminado correctamente" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar el conductor" }, { status: 400 })
  }
}

