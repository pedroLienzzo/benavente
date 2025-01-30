"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | string[]>("")
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await register(name, email, password)
      router.push("/")
    } catch (err: any) {
      if (err.details) {
        setError(err.details)
      } else {
        setError(err.message || "Error en el registro. Por favor, inténtelo de nuevo.")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  placeholder="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {Array.isArray(error) ? (
                    <ul className="list-disc pl-4">
                      {error.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : (
                    error
                  )}
                </AlertDescription>
              </Alert>
            )}
            <Button className="w-full mt-4" type="submit">
              Registrarse
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

