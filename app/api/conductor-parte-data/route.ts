import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Vehiculo from "@/models/Vehiculo"
import Cliente from "@/models/Cliente"
import Material from "@/models/Material"
import Transportista from "@/models/Transportista"
import Conductor from "@/models/Conductor"

export async function GET(req: Request) {
  try {
    // console.log("Connecting to the database...");
    await connectDB()
    // console.log("Database connected successfully.");
    
    // Get all conductors to extract their assigned vehicles
    // console.log("Fetching conductors...");
    const conductores = await Conductor.find({}, 'matriculaAsignada')
    // console.log("Conductors fetched:", conductores);
    const matriculasAsignadas = conductores.map(c => c.matriculaAsignada).filter(Boolean)
    // console.log("Assigned matriculas:", matriculasAsignadas);
    
    // Get all data needed
    // console.log("Fetching vehiculos, clientes, materiales, and transportistas...");
    const [vehiculos, clientes, materiales, transportistas] = await Promise.all([
      Vehiculo.find({}), // Remove the matricula filter to get all vehicles
      Cliente.find({}),
      Material.find({}),
      Transportista.find({})
    ]);
    // console.log("Data fetched successfully.");
    // console.log("Vehiculos:", vehiculos);
    // console.log("Clientes:", clientes);
    // console.log("Materiales:", materiales);
    // console.log("Transportistas:", transportistas);

    const response = {
      vehiculos: vehiculos.map(v => ({ _id: v._id, matricula: v.matricula })),
      clientes: clientes.map(c => ({ _id: c._id, nombre: c.nombre })),
      materiales: materiales.map(m => ({ _id: m._id, nombre: m.nombre })),
      transportistas: transportistas.map(t => ({ _id: t._id, nombre: t.nombre }))
    };
    // console.log("Response:", response);
    return NextResponse.json(response);
  
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}