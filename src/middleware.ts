import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // درخواست به API برای گرفتن اطلاعات کاربر
    const response = await fetch(`${req.nextUrl.origin}/api/auth/check-auth`, {
        method: "GET",
        headers: {
            cookie: req.headers.get("cookie") || "", // کوکی‌ها رو بفرست تا session چک بشه
        },
    });

<<<<<<< HEAD
  if (!authToken) {
    console.log('redirect')
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    
    const { payload } = await jwtVerify(authToken, secret);
    console.log('reached');
    
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
=======
    let user;
    try {
        const data = await response.json();
        user = data?.user || null; // فرض می‌کنیم API یه شیء user برمی‌گردونه
    } catch (error) {
        console.error("Error fetching auth data:", error);
        user = null;
    }
    console.log("user", user)
    // اگه کاربر لاگین نکرده باشه و بخواد به مسیر محافظت‌شده بره
    if (!user) {
        const protectedPaths = ["/dashboard", "/profile", "/admin"];
        if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d
    }

    // چک کردن نقش برای مسیرهای ادمین
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!user || user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // اگه همه‌چیز درست باشه، ادامه بده
    return NextResponse.next();
<<<<<<< HEAD
  } catch (error) {
    console.error("Token verification error:", error);
    // return NextResponse.redirect(new URL("/login", request.url));
  }
=======
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d
}

// مسیرهایی که Middleware باید روشون اعمال بشه
export const config = {
<<<<<<< HEAD
  matcher: ["/dashboard/:path*", "/admin/:path*"], // Only run middleware on these routes
};
=======
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d
