"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConductorLoginPage() {
  const [correo, setCorreo] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      // console.log("Attempting login with:", { correo, contraseña })
      const result = await signIn("conductor-login", {
        correo: correo,
        contraseña: contraseña,
        redirect: false,
      })
      // console.log("Login result:", result)

      if (result?.error) {
        setError("Credenciales inválidas")
        return
      }

      if (result?.ok) {
        router.push("/conductor-dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Error al iniciar sesión")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ffffff]">
      <Card className="w-[400px] border border-[#dadada] rounded-2xl shadow-sm">
        <CardContent className="pt-8 px-8 pb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#002fff] rounded-xl flex items-center justify-center mb-4">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#000000]">Acceso Conductores</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="h-12 border-[#dadada] rounded-lg focus-visible:ring-[#002fff]"
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="h-12 border-[#dadada] rounded-lg focus-visible:ring-[#002fff]"
                required
              />
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#dadada] data-[state=checked]:bg-[#002fff] data-[state=checked]:border-[#002fff]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-[#000000]">
                Recordar contraseña
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-12 bg-[#002fff] hover:bg-[#002fff]/90 text-white rounded-full">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

