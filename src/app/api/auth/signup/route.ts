import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import { SignJWT } from "jose"; // Use jose for Edge compatibility

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to MongoDB
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Save the user to MongoDB
    const user = new User({
      email,
      password: hashedPassword,
      role: "user", // Default role
    });
    await user.save();

    // Create a JWT token for the user
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({ id: user._id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Set the token as a cookie
    const response = NextResponse.json(
      { message: "User created and logged in successfully", user },
      { status: 201 }
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
    console.error("Signup error:", error);
    return NextResponse.json({ message: "An error occurred during signup" }, { status: 500 });
  }
}