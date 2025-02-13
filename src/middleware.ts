import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose for Edge compatibility

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(authToken, secret);

    // Define protected routes and their required roles
    const protectedRoutes = [
      { path: "/dashboard", role: "user" },
      { path: "/admin", role: "admin" },
    ];

    // Check if the requested path is protected
    const matchedRoute = protectedRoutes.find((route) =>
      request.nextUrl.pathname.startsWith(route.path)
    );

    if (matchedRoute) {
      // Redirect users who don't have the required role
      if (payload.role !== matchedRoute.role) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Continue processing the request
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"], // Only run middleware on these routes
};