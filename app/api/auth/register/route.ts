import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está en uso" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create the new user
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "conductor",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error al registrar el usuario:", error);
    return NextResponse.json({ error: error.message || "Error al registrar el usuario" }, { status: 500 });
  }
} 