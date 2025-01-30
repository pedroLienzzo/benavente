"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, LogOut, Plus, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!user) return null

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <nav className="h-16 border-b border-[#dadada] bg-white sticky top-0 z-50">
      <div className="container mx-auto h-full px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo and primary navigation */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#002fff]">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
            </Link>
            <div className="flex space-x-2">
              <Link
                href="/partes"
                className={cn(
                  "rounded-full px-4 py-2",
                  isActive("/partes") ? "bg-[#002fff] text-white" : "text-[#626262] hover:text-[#000000]",
                )}
              >
                Partes
              </Link>
              <Link
                href="/lineas"
                className={cn(
                  "rounded-full px-4 py-2",
                  isActive("/lineas") ? "bg-[#002fff] text-white" : "text-[#626262] hover:text-[#000000]",
                )}
              >
                Líneas
              </Link>
            </div>
          </div>

          {/* Center navigation */}
          <div className="flex space-x-6">
            <Link
              href="/conductores"
              className={cn("text-[#626262] hover:text-[#000000]", isActive("/conductores") && "text-[#000000]")}
            >
              Conductores
            </Link>
            <Link
              href="/transportistas"
              className={cn("text-[#626262] hover:text-[#000000]", isActive("/transportistas") && "text-[#000000]")}
            >
              Transportistas
            </Link>
            <Link
              href="/vehiculos"
              className={cn("text-[#626262] hover:text-[#000000]", isActive("/vehiculos") && "text-[#000000]")}
            >
              Vehículos
            </Link>
            <Link
              href="/clientes"
              className={cn("text-[#626262] hover:text-[#000000]", isActive("/clientes") && "text-[#000000]")}
            >
              Clientes
            </Link>
            <Link
              href="/materiales"
              className={cn("text-[#626262] hover:text-[#000000]", isActive("/materiales") && "text-[#000000]")}
            >
              Materiales
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button asChild className="rounded-full bg-[#002fff] px-6 hover:bg-[#002fff]/90">
              <Link href="/partes/nuevo">
                <Plus className="mr-2 h-5 w-5" />
                Parte
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-[#626262] hover:text-[#000000]">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-[#626262] hover:text-[#000000]">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

