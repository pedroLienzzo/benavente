// app/api/jornadas/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Jornada from "@/models/Jornada";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedJornada = await Jornada.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedJornada) {
      return NextResponse.json({ error: "Jornada no encontrada" }, { status: 404 });
    }
    return NextResponse.json(updatedJornada);
  } catch (error) {
    console.error("Error updating jornada:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedJornada = await Jornada.findByIdAndDelete(params.id);
    if (!deletedJornada) {
      return NextResponse.json({ error: "Jornada no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: "Jornada eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting jornada:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}