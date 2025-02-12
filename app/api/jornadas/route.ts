// app/api/jornadas/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Jornada from "@/models/Jornada";

export async function GET() {
  try {
    await dbConnect();
    const jornadas = await Jornada.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(jornadas);
  } catch (error) {
    console.error("Error fetching jornadas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { nombre } = body;
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }
    const newJornada = await Jornada.create({ nombre });
    return NextResponse.json(newJornada, { status: 201 });
  } catch (error) {
    console.error("Error creating jornada:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}