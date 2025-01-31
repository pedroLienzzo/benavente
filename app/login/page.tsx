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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const result = await signIn("user-login", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales inválidas")
      } else {
        router.push("/") // Redirect to dashboard on success
        router.refresh() // Refresh to update session state
      }
    } catch (err: any) {
      setError("Error al iniciar sesión. Por favor, inténtelo de nuevo.")
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
            <h1 className="text-2xl font-semibold text-[#000000]">Logística Rube</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-[#dadada] rounded-lg focus-visible:ring-[#002fff]"
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

