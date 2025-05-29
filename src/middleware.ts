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
    }

    // چک کردن نقش برای مسیرهای ادمین
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!user || user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // اگه همه‌چیز درست باشه، ادامه بده
    return NextResponse.next();
}

// مسیرهایی که Middleware باید روشون اعمال بشه
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};