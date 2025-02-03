"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ParteForm } from "@/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function EditarPartePage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const [parte, setParte] = useState<ParteTrabajo | null>(null)
  const session = useSession()

  useEffect(() => {
    fetchParte()

  }, [id])

  const fetchParte = async () => {
    try {
      const res = await fetch(`/api/partes/${id}`)
      if (!res.ok) throw new Error("Error al obtener el parte")
      
      const { data } = await res.json()
      // Format the date and structure the parte data
      const formattedParte = {
        ...data,
        fecha: new Date(data.fecha).toISOString().split('T')[0], // Format date to YYYY-MM-DD
      }
      setParte(formattedParte)
    } catch (error) {
      console.error("Error fetching parte:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el parte",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (parteData: ParteTrabajo) => {
    const res = await fetch(`/api/partes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parteData),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }

    toast({
      title: "Éxito",
      description: "Parte de trabajo actualizado correctamente",
    })
    router.push("/partes")
  }

  if (!parte) return <LoadingSpinner />


  console.log("initial Data: ", parte)

  return (
    <ParteForm
      initialData={parte}
      onSubmit={handleSubmit}
      backUrl="/partes"
      title="Editar parte de trabajo"
      isEditing={true}
      userType="admin"
    />
  )
}