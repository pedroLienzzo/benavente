"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ParteForm } from "@/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"
import LoadingSpinner from "@/components/LoadingSpinner"

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
  const [isLoading, setIsLoading] = useState(true)
  const [parteData, setParteData] = useState<ParteData>({
    transportistas: [],
    vehiculos: [],
    clientes: [],
    materiales: [],
  })

  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.type !== "conductor") {
      router.push("/conductor-login")
      return
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/conductor-parte-data", {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Error al obtener los datos")
        }

        const data = await res.json()
        setParteData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Error al cargar los datos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, status, router])

  const handleSubmit = async (parteData: ParteTrabajo) => {
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

  if (status === "loading" || isLoading) return <LoadingSpinner />
  if (!session?.user) {
    router.push("/conductor-login")
    return null
  }

  // Create initialData from session
  const initialData: ParteTrabajo = {
    fecha: new Date().toISOString().split("T")[0],
    matricula: session.user.vehiculo || "",
    kilometros: 0,
    conductor: session.user.name || "",
    transportista: session.user.transportista || "",
    estado: "Pendiente",
    lineas: [{
      cliente: "",
      lugarCarga: "",
      lugarDescarga: "",
      espera: "",
      trabajo: "",
      toneladas: 0,
      material: "",
      jornada: "",
    }]
  }

  return (
    <ParteForm
      initialData={initialData}
      onSubmit={handleSubmit}
      backUrl="/conductor-dashboard"
      title="Nuevo parte de trabajo"
      userType="conductor"
      initialParteData={parteData}
    />
  )
}