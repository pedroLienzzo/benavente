import jwt from "jsonwebtoken"

export async function verifyAuth(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    throw new Error("Token inválido")
  }
}

