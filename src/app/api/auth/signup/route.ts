import { NextResponse } from "next/server";
import client from "@/utils/db";
import { saltAndHashPassword } from "@/utils/password";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    await client.connect();
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    const hashedPassword = await saltAndHashPassword(password);
    const newUser = { email, password: hashedPassword, role: "user", createdAt: new Date() };
    await db.collection("users").insertOne(newUser);
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const runtime = "nodejs"; // برای MongoDB