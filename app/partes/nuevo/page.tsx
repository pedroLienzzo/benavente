"use client"

import { useRouter } from "next/navigation"
import { ParteForm } from "@/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"

export default function NuevoPartePage() {
  const router = useRouter()
  const { toast } = useToast()

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
      router.push("/partes")
    } catch (error) {
      throw error
    }
  }

  return (
    <ParteForm
      onSubmit={handleSubmit}
      backUrl="/partes"
      title="Nuevo parte de trabajo"
      userType="admin"
    />
  )
}

