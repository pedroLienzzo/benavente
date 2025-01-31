"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ParteForm } from "@/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"

interface ParteData {
  transportistas: { _id: string; nombre: string }[]
  vehiculos: { _id: string; matricula: string }[]
  clientes: { _id: string; nombre: string }[]
  materiales: { _id: string; nombre: string }[]
}

export default function NuevoParteConductorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | string[]>("")
  const [isLoading, setIsLoading] = useState(true)
  const [parteData, setParteData] = useState<ParteData>({
    transportistas: [],
    vehiculos: [],
    clientes: [],
    materiales: [],
  })
  const [parte, setParte] = useState<ParteTrabajo>({
    fecha: new Date().toISOString().split("T")[0],
    matricula: "",
    kilometros: 0,
    conductor: "",
    transportista: "",
    estado: "Pendiente",
    lineas: [
      {
        cliente: "",
        lugarCarga: "",
        lugarDescarga: "",
        espera: "",
        trabajo: "",
        toneladas: 0,
        material: "",
        jornada: "",
      },
    ],
  })

  useEffect(() => {
    // console.log("1. Page Effect - Status:", status)
    // console.log("2. Page Effect - Session:", session)

    if (status === "loading") return

    if (!session || session.user.type !== "conductor") {
      // console.log("3. Redirecting - No valid session")
      router.push("/conductor-login")
      return
    }

    // Update the parte state with session data
    setParte(prev => ({
      ...prev,
      conductor: session.user.name,
      matricula: session.user.vehiculo,
      transportista: session.user.transportista
    }))

    const fetchData = async () => {
      try {
        console.log("4. Fetching data")
        const res = await fetch("/api/conductor-parte-data", {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        // console.log("5. Response status:", res.status)
        
        if (!res.ok) {
          const errorData = await res.json()
          console.log("6. Error data:", errorData)
          throw new Error(errorData.error || "Error al obtener los datos")
        }

        const data = await res.json()
        console.log("6. Success data:", data)

        setParteData(data)
      } catch (error) {
        console.error("7. Fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, status, router])

  const handleSubmit = async (parteData: ParteTrabajo) => {
    console.log("Submitting parte:", parteData)
    try {
      const res = await fetch("/api/partes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parteData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al crear el parte de trabajo")
      }

      toast({
        title: "Éxito",
        description: "Parte de trabajo creado correctamente",
      })
      router.push("/conductor-dashboard")
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "Error al crear el parte de trabajo",
        variant: "destructive",
      })
      throw error
    }
  }

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!session?.user) {
    router.push("/conductor-login")
    return null
  }

  return (
    <ParteForm
      onSubmit={handleSubmit}
      backUrl="/conductor-dashboard"
      title="Nuevo parte de trabajo"
      showConductorSelect={true}
      defaultConductor={session.user.name}
      initialParteData={parteData}
      initialValues={parte} // Pass the updated parte state
    />
  )
}