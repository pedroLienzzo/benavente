"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "conductor"
}

type Conductor = {
  _id: string
  nombre: string
  correo: string
}

type AuthContextType = {
  user: User | null
  conductor: Conductor | null
  login: (email: string, password: string) => Promise<void>
  loginConductor: (correo: string, contraseña: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [conductor, setConductor] = useState<Conductor | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        if (pathname === "/login" || pathname === "/register") {
          router.push("/")
        }
      } else {
        setUser(null)
        const conductorRes = await fetch("/api/auth/conductor/me")
        if (conductorRes.ok) {
          const conductorData = await conductorRes.json()
          setConductor(conductorData)
          if (pathname === "/conductor-login") {
            router.push("/conductor-dashboard")
          }
        } else {
          setConductor(null)
          if (pathname !== "/login" && pathname !== "/register" && pathname !== "/conductor-login") {
            router.push("/login")
          }
        }
      }
    } catch (error) {
      console.error("Failed to check authentication status", error)
      setUser(null)
      setConductor(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        router.push("/")
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const loginConductor = async (correo: string, contraseña: string) => {
    try {
      const res = await fetch("/api/auth/conductor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      })

      if (res.ok) {
        const conductorData = await res.json()
        setConductor(conductorData)
        router.push("/conductor-dashboard")
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Login conductor error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setConductor(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        router.push("/")
      } else {
        const errorData = await res.json()
        throw errorData
      }
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <AuthContext.Provider value={{ user, conductor, login, loginConductor, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

