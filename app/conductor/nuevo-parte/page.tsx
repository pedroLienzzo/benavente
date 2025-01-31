"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ParteForm } from "@/app/components/ParteForm"
import { ParteTrabajo } from "@/types/parte"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/providers/AuthProvider"

interface LineaParte {
  cliente: string
  lugarCarga: string
  lugarDescarga: string
  espera: string
  trabajo: string
  toneladas: number
  material: string
  jornada: string
}

interface ParteData {
  transportistas: { _id: string; nombre: string }[]
  vehiculos: { _id: string; matricula: string }[]
  clientes: { _id: string; nombre: string }[]
  materiales: { _id: string; nombre: string }[]
}

export default function NuevoParteConductorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { conductor } = useAuth()
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
    conductor: conductor?.nombre || "",
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
    console.log("Conductor data:", conductor);
    console.log("Initial parte state:", parte);
  }, [conductor, parte]);

  useEffect(() => {
    console.log("useEffect triggered with conductor:", conductor);
    const checkAuthAndFetchData = async () => {
      if (!conductor) {
        router.push("/conductor-login");
        return;
      }
      try {
        const authRes = await fetch("/api/auth/conductor/me");
        if (!authRes.ok) {
          throw new Error("Authentication failed");
        }
        await fetchParteData();
      } catch (error) {
        toast({
          title: "Error de autenticación",
          description: "Por favor, inicie sesión nuevamente.",
          variant: "destructive",
        });
        router.push("/conductor-login");
      }
    };

    checkAuthAndFetchData();
  }, [conductor, router]);

  const fetchParteData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/conductor-parte-data");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error: ${res.status} - ${text.slice(0, 100)}`);
      }
      const data = await res.json();

      // Update parte state with fetched data if necessary
      setParte(prev => ({
        ...prev,
        // Example: Update matricula and transportista if needed
        matricula: data.vehiculos[0]?.matricula || prev.matricula,
        transportista: data.transportistas[0]?.nombre || prev.transportista,
      }));

      setParteData(data);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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

  if (!conductor) return null

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <ParteForm
      onSubmit={handleSubmit}
      backUrl="/conductor-dashboard"
      title="Nuevo parte de trabajo"
      showConductorSelect={false}
      defaultConductor={conductor.nombre}
    />
  )
}