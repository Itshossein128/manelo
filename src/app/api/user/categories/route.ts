import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Category from "@/models/Category";

interface CategoryForUser {
    name: string;
    href: string;
    gender: "men" | "women";
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender") as CategoryForUser["gender"] | null;

        const query = gender ? { gender } : {};

        // Fetch only the required fields
        const categories = await Category.find(query)
            .select("name href gender")
            .lean<CategoryForUser[]>();

        return NextResponse.json(
            {
                data: categories,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("[API Error]:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}

// Routing Configuration
export const dynamic = "force-dynamic";
export const revalidate = 0;