import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route"; // مسیر درست نسبت به پروژه‌ت

export async function GET(req: Request) {
  try {
    // گرفتن session با استفاده از auth
    const session = await auth();

    // اگه session نباشه یا کاربر لاگین نکرده باشه
    if (!session || !session.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // ساخت شیء user با اطلاعات مورد نیاز
    const user = {
      id: session.user.id,
      email: session.user.email, // اختیاری، اگه توی Middleware لازم داری
      role: session.user.role || "user",
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in check-auth:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export const runtime = "nodejs"; // برای کار با MongoDBAdapter