import dbConnect from "./mongodb"
import { ParteTrabajo } from "@/schemas/ParteTrabajoSchema"
import User from "../models/User"
import jwt from "jsonwebtoken"
import type { ParteTrabajo as ParteTrabajoType } from "@/types/parteTrabajo"

// User functions
export async function createUser(userData: any) {
  await dbConnect()
  const user = await User.create(userData)
  return user.toObject()
}

export async function findUserByEmail(email: string) {
  await dbConnect()
  const user = await User.findOne({ email }).select("+password")
  return user
}

export async function findUserById(id: string) {
  await dbConnect()
  const user = await User.findById(id)
  return user ? user.toObject() : null
}

// Parte de trabajo functions
export async function getPartesTrabajo() {
  await dbConnect()
  const partes = await ParteTrabajo.find({}).sort({ createdAt: -1 }).lean()
  // console.log("Fetched partes:", partes)
  return partes
}

export async function getParteTrabajoById(id: string) {
  await dbConnect()
  return ParteTrabajo.findById(id).lean()
}

export async function createParteTrabajo(data: ParteTrabajoType) {
  await dbConnect()
  const parteTrabajo = await ParteTrabajo.create(data)
  // console.log("Received data in createParteTrabajo: ", data)
  // console.log("Created parte:", parteTrabajo)
  return parteTrabajo.toObject()
}

export async function updateParteTrabajo(id: string, data: any) {
  await dbConnect()
  const parteTrabajo = await ParteTrabajo.findByIdAndUpdate(id, data, { new: true }).lean()
  return parteTrabajo
}

export async function deleteParteTrabajo(id: string) {
  await dbConnect()
  await ParteTrabajo.findByIdAndDelete(id)
}

// Líneas functions
export async function getAllLineas() {
  await dbConnect()
  const partes = await ParteTrabajo.find({}).lean()
  const lineas = partes.reduce((acc: any[], parte: any) => {
    const lineasConInfo = parte.lineas.map((linea: any, index: number) => ({
      ...linea,
      _id: linea._id || `${parte._id}-${index}`,
      parteId: parte._id,
      fecha: parte.fecha,
      conductor: parte.conductor,
      transportista: parte.transportista,
      vehiculo: parte.matricula,
      estado: parte.estado,
    }))
    return [...acc, ...lineasConInfo]
  }, [])
  // console.log("Fetched lineas:", lineas)
  return lineas
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await findUserById(decoded.id)
    return user
  } catch (error) {
    return null
  }
}

