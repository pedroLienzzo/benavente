import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"
import Cliente from "@/models/Cliente"
import Material from "@/models/Material"
import Transportista from "@/models/Transportista"
import Conductor from "@/models/Conductor"

export async function GET(req: Request) {
  try {
    await connectDB()
    const conductores = await Conductor.find({}, 'matriculaAsignada')
    const matriculasAsignadas = conductores.map(c => c.matriculaAsignada).filter(Boolean)
    const [vehiculos, clientes, materiales, transportistas] = await Promise.all([
      Vehiculo.find({}),
      Cliente.find({}),
      Material.find({}),
      Transportista.find({})
    ]);

    const response = {
      vehiculos: vehiculos.map(v => ({ _id: v._id, matricula: v.matricula })),
      clientes: clientes.map(c => ({ _id: c._id, nombre: c.nombre })),
      materiales: materiales.map(m => ({ _id: m._id, nombre: m.nombre })),
      transportistas: transportistas.map(t => ({ _id: t._id, nombre: t.nombre }))
    };

    return NextResponse.json(response);
  
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}