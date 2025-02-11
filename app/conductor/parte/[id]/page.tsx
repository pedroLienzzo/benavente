"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ParteForm } from "@/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ConductorPartePage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [parte, setParte] = useState<ParteTrabajo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    // Ensure only a conductor can access this page.
    if (!session || session.user.type !== "conductor") {
      router.push("/conductor-login")
      return
    }

    fetchParte()
  }, [id, session, status, router])

  const fetchParte = async () => {
    try {
      const res = await fetch(`/api/partes/${id}`)
      if (!res.ok) throw new Error("Error al obtener el parte")
      const { data } = await res.json()

      // Format the date to YYYY-MM-DD for the form
      const formattedParte = {
        ...data,
        fecha: new Date(data.fecha).toISOString().split("T")[0],
      }

      // Validate that the part belongs to the logged-in conductor.
      // Here we assume the fetched parte has a field "conductor" that contains the assigned conductor's name.
      if (session && formattedParte.conductor !== session.user.name) {
        toast({
          title: "No autorizado",
          description: "No tienes permisos para editar este parte de trabajo",
          variant: "destructive",
        })
        router.push("/conductor-dashboard")
        return
      }

      setParte(formattedParte)
    } catch (error) {
      console.error("Error fetching parte:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el parte",
        variant: "destructive",
      })
      router.push("/conductor-dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (parteData: ParteTrabajo) => {
    try {
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
      router.push("/conductor-dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el parte de trabajo",
        variant: "destructive",
      })
    }
  }

  if (status === "loading" || !session || isLoading || !parte) {
    return <LoadingSpinner />
  }

  return (
    <ParteForm
      initialData={parte}
      onSubmit={handleSubmit}
      backUrl="/conductor-dashboard"
      title="Editar parte de trabajo"
      isEditing={true}
      userType="conductor"
    />
  )
} 