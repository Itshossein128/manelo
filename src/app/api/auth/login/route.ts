import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import { SignJWT } from "jose"; // Use jose for Edge compatibility

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Connect to MongoDB
    await dbConnect();

    // Fetch the user from MongoDB
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Create a JWT token for the user
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({ id: user._id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Set the token as a cookie
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
  }
}