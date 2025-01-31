"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Share2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ParteTrabajo } from "@/types/parte"

export default function ConductorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [partes, setPartes] = useState<ParteTrabajo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session || session.user.type !== "conductor") {
      router.push("/conductor-login")
      return
    }
    fetchPartes()
  }, [session, status, router])

  const fetchPartes = async () => {
    try {
      const res = await fetch("/api/conductor/partes")
      if (!res.ok) throw new Error("Error al obtener los partes")
      const data = await res.json()
      setPartes(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || !session) return null

  return (
    <div className="min-h-screen bg-[#ffffff] px-4 pt-4 pb-20">
      {/* Status Bar - For demo purposes */}
      <div className="flex justify-between items-center mb-6 text-sm text-[#000000]">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>●●●●●</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-lg text-[#000000]">Hola, {session.user.name}</p>
          <h1 className="text-3xl font-bold text-[#000000]">Partes de trabajo</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full bg-[#002fff] hover:bg-[#002fff]/90 h-12 w-12 p-0">
            <Link href="/conductor/nuevo-parte">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#626262] hover:text-[#000000]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Partes List */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-[#dadada]">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))
        ) : partes.length === 0 ? (
          <div className="text-center text-[#626262] py-8">No hay partes de trabajo disponibles</div>
        ) : (
          partes.map((parte) => (
            <Link
              key={parte._id}
              href={`/conductor/partes/${parte._id}`}
              className="block bg-white rounded-2xl p-4 border border-[#dadada]"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-[#002fff] text-lg font-medium">Parte #{parte._id.slice(-5).toUpperCase()}</p>
                  <p className="text-[#626262]">
                    {new Date(parte.fecha).toLocaleDateString("es", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    · {parte.matricula} · {parte.kilometros.toLocaleString()} Kms
                  </p>
                  <p className="text-[#626262]">
                    {parte.lineas.length} {parte.lineas.length === 1 ? "línea" : "líneas"}
                  </p>
                </div>
                <ChevronRight className="text-[#626262]" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

