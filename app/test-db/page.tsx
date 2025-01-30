"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TestResult {
  success: boolean
  message: string
  data?: any
}

export default function TestDBPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error al conectar con la base de datos",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-primary mb-6">Prueba de Conexión a MongoDB</h1>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Estado de la Conexión</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testConnection} disabled={isLoading} className="bg-primary hover:bg-primary/90 mb-4">
            {isLoading ? "Probando..." : "Probar Conexión"}
          </Button>
          {testResult && (
            <div
              className={`p-4 rounded-md ${testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <p className="font-semibold">{testResult.success ? "Conexión exitosa" : "Error de conexión"}</p>
              <p>{testResult.message}</p>
              {testResult.data && (
                <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

