// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import Conductor from "@/models/Conductor"
import dbConnect from "@/lib/mongodb"

// Export authOptions as a separate object
export const authOptions = {
  providers: [
    // Admin/User Login Provider
    CredentialsProvider({
      id: "user-login",
      name: "User Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect()
          const user = await User.findOne({ 
            email: credentials?.email 
          }).select("+password")
          
          if (!user) return null
          
          const isValid = await bcrypt.compare(
            credentials?.password || '', 
            user.password
          )
          
          if (!isValid) return null
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            type: "user"
          }
        } catch (error) {
          console.error("User auth error:", error)
          return null
        }
      }
    }),
    // Conductor Login Provider
    CredentialsProvider({
      id: "conductor-login",
      name: "Conductor Credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        contraseña: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("1. Conductor auth starting with:", credentials?.correo)
          await dbConnect()
          
          const conductor = await Conductor.findOne({ 
            correo: credentials?.correo 
          }).select("+contraseña")
          
          console.log("2. Conductor found:", !!conductor)
          if (!conductor) return null
          
          const isValid = await bcrypt.compare(
            credentials?.contraseña || '', 
            conductor.contraseña
          )
          console.log("3. Password valid:", isValid)
          
          if (!isValid) return null

          return {
            id: conductor._id.toString(),
            email: conductor.correo,
            name: conductor.nombre,
            type: "conductor",
            transportista: conductor.transportistaAsociado,
            vehiculo: conductor.matriculaAsignada
          }
        } catch (error) {
          console.error("Conductor auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.type = user.type
        token.role = user.role // for admin users
        token.transportista = user.transportista // for conductors
        token.vehiculo = user.vehiculo // for conductors
        token.nombre = user.name // Add this line to include conductor's name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.type = token.type as string
        session.user.role = token.role as string // for admin users
        session.user.transportista = token.transportista as string // for conductors
        session.user.vehiculo = token.vehiculo as string // for conductors
        session.user.nombre = token.nombre as string // Add this line
      }
      return session
    }
  },
  pages: {
    signIn: "/conductor-login", // Default sign in page
    error: "/conductor-login"
  },
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }