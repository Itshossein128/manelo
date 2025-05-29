import { NextRequest, NextResponse } from "next/server";
import client from "@/app/utils/db";

interface CategoryForUser {
    name: string;
    href: string;
    gender: "men" | "women";
}

export async function GET(request: NextRequest) {
    try {
        const db = client.db();
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender") as CategoryForUser["gender"] | null;

        const query = gender ? { gender } : {};

        // Fetch categories using MongoDB client
        const categories = await db
            .collection("categories")
            .find(query)
            .project({ name: 1, href: 1, gender: 1, _id: 0 })
            .toArray() as CategoryForUser[];

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