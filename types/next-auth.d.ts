import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    type: "user" | "conductor"
    role?: string
    transportista?: string
    vehiculo?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      type: string
      role?: string
      transportista?: string
      vehiculo?: string
    }
  }
} 