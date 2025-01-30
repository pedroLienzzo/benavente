import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    const updatedVehiculo = await Vehiculo.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updatedVehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }
    return NextResponse.json(updatedVehiculo)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar el vehículo" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedVehiculo = await Vehiculo.findByIdAndDelete(id)
    if (!deletedVehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ message: "Vehículo eliminado correctamente" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar el vehículo" }, { status: 400 })
  }
}

