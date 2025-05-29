import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import client from "@/utils/db";
import { ObjectId } from "mongodb";

interface CategoryDocument {
    _id?: string;
    name: string;
    href: string;
    gender: "men" | "women";
    createdAt?: Date;
    updatedAt?: Date;
}

const CategorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters")
        .trim(),
    href: z
        .string()
        .min(1, "URL cannot be empty")
        .max(255, "URL cannot exceed 255 characters")
        .refine((val) => !/\s/.test(val), {
            message: "URL cannot contain spaces",
        }),
    gender: z.enum(["men", "women"], {
        errorMap: () => ({ message: "Gender must be either 'men' or 'women'" }),
    }),
})

type CategoryInput = z.infer<typeof CategorySchema>;

class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}

function handleApiError(error: unknown): NextResponse {
    console.error("[API Error]:", error);

    let statusCode = 500;
    let errorMessage = "An unexpected error occurred";
    let errorDetails: any = null;

    if (error instanceof z.ZodError) {
        statusCode = 400;
        errorMessage = error.errors[0].message;
        errorDetails = error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
        }));
    } else if (error instanceof ApiError) {
        statusCode = error.statusCode;
        errorMessage = error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;

        if (error.name === "MongoServerError" && (error as any).code === 11000) {
            statusCode = 409;
            if ((error as any).keyPattern?.name) {
                errorMessage = "A category with this name already exists for the specified gender";
            } else if ((error as any).keyPattern?.href) {
                errorMessage = "A category with this URL already exists for the specified gender";
            }
        }
    }

    return NextResponse.json(
        {
            error: errorMessage,
            details: errorDetails,
        },
        { status: statusCode }
    );
}

export async function GET(request: NextRequest) {
    try {
        const db = client.db();
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender") as CategoryDocument["gender"] | null;

        const query = gender ? { gender } : {};
        const categories = await db.collection('categories').find(query).toArray();

        return NextResponse.json(
            {
                data: categories,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const db = client.db();
        const body = await request.json();
        const validatedData = CategorySchema.parse(body) as CategoryInput;

        validatedData.href = validatedData.href.toLowerCase();

        const existingCategoryByName = await db.collection('categories').findOne({
            gender: validatedData.gender,
            name: validatedData.name,
        });

        if (existingCategoryByName) {
            throw new ApiError("A category with this name already exists for the specified gender", 409);
        }

        const existingCategoryByHref = await db.collection('categories').findOne({
            gender: validatedData.gender,
            href: validatedData.href,
        });

        if (existingCategoryByHref) {
            throw new ApiError("A category with this URL already exists for the specified gender", 409);
        }

        const newCategory = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('categories').insertOne(newCategory);

        return NextResponse.json(
            { ...newCategory, _id: result.insertedId.toString() },
            { status: 201 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const db = client.db();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ApiError("Category ID is required", 400);
        }

        const result = await db.collection('categories').findOneAndDelete({
            _id: new ObjectId(id)
        });

        if (!result.value) {
            throw new ApiError("Category not found", 404);
        }

        return NextResponse.json(
            { message: "Category deleted successfully", data: result.value },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const db = client.db();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ApiError("Category ID is required", 400);
        }

        const body = await request.json();
        const validatedData = CategorySchema.parse(body) as CategoryInput;
        validatedData.href = validatedData.href.toLowerCase();

        const existingCategoryByName = await db.collection('categories').findOne({
            gender: validatedData.gender,
            name: validatedData.name,
            _id: { $ne: new ObjectId(id) },
        });

        if (existingCategoryByName) {
            throw new ApiError("A category with this name already exists for the specified gender", 409);
        }

        const existingCategoryByHref = await db.collection('categories').findOne({
            gender: validatedData.gender,
            href: validatedData.href,
            _id: { $ne: new ObjectId(id) },
        });

        if (existingCategoryByHref) {
            throw new ApiError("A category with this URL already exists for the specified gender", 409);
        }

        const updateData = {
            ...validatedData,
            updatedAt: new Date()
        };

        const result = await db.collection('categories').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new ApiError("Category not found", 404);
        }

        return NextResponse.json(result.value, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

// Routing Configuration
export const dynamic = "force-dynamic";
export const revalidate = 0;