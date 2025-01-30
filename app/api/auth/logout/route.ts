import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear both cookies
  cookies().delete("auth_token")
  cookies().delete("user")

  return NextResponse.json({ success: true })
}

