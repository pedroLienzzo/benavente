import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongodb"
import ParteTrabajo from "@/models/ParteTrabajo"
import { authOptions } from "../../auth/[...nextauth]/route" // Correct import
import { Session } from "next-auth"

export async function GET() {
  try {
    console.log("1. Starting partes fetch")
    const session = await getServerSession(authOptions) as Session
    console.log("2. Session data:", JSON.stringify(session, null, 2))
    
    if (!session || session.user.type !== "conductor") {
      console.log("3. Auth failed:", { session: !!session, type: session?.user?.type })
      console.log("session: ", session)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await dbConnect()
    console.log("4. DB connected, searching partes for conductor:", session.user.name)

    // Get partes for this conductor
    const partes = await ParteTrabajo.find({ 
      conductor: session.user.name 
    }).sort({ createdAt: -1 }).lean()
    
    console.log("5. Partes found:", partes.length)
    return NextResponse.json(partes)
  } catch (error) {
    console.error("6. Error fetching partes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}