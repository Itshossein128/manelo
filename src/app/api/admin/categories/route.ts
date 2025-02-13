import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/utils/db";
import Category from "@/models/Category";

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
        // Handle Zod validation errors
        statusCode = 400;
        errorMessage = error.errors[0].message;
        errorDetails = error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
        }));
    } else if (error instanceof ApiError) {
        // Handle custom ApiError
        statusCode = error.statusCode;
        errorMessage = error.message;
    } else if (error instanceof Error) {
        // Handle generic errors
        errorMessage = error.message;

        // Handle MongoDB duplicate key error
        if (error.name === "MongoServerError" && (error as any).code === 11000) {
            statusCode = 409;

            // Check which field caused the duplicate error
            if ((error as any).keyPattern?.name) {
                errorMessage = "A category with this name already exists for the specified gender";
            } else if ((error as any).keyPattern?.href) {
                errorMessage = "A category with this URL already exists for the specified gender";
            }
        }
    }

    // Return a consistent error response
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
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender") as CategoryDocument["gender"] | null;

        const query = gender ? { gender } : {};

        const categories = await Category.find(query).lean<CategoryDocument[]>();

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
        await dbConnect();

        const body = await request.json();
        const validatedData = CategorySchema.parse(body) as CategoryInput;

        // Normalize the href to lowercase
        validatedData.href = validatedData.href.toLowerCase();

        // Check for existing category with the same name and gender
        const existingCategoryByName = await Category.findOne({
            gender: validatedData.gender,
            name: validatedData.name,
        });

        if (existingCategoryByName) {
            throw new ApiError("A category with this name already exists for the specified gender", 409);
        }

        // Check for existing category with the same href and gender
        const existingCategoryByHref = await Category.findOne({
            gender: validatedData.gender,
            href: validatedData.href,
        });

        if (existingCategoryByHref) {
            throw new ApiError("A category with this URL already exists for the specified gender", 409);
        }

        // Create and save the new category
        const newCategory = new Category(validatedData);
        await newCategory.save();

        return NextResponse.json(newCategory.toObject(), { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ApiError("Category ID is required", 400);
        }

        // Find and delete the category
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            throw new ApiError("Category not found", 404);
        }

        return NextResponse.json(
            { message: "Category deleted successfully", data: deletedCategory },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}
export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ApiError("Category ID is required", 400);
        }

        const body = await request.json();
        const validatedData = CategorySchema.parse(body) as CategoryInput;

        // Normalize the href to lowercase
        validatedData.href = validatedData.href.toLowerCase();

        // Check for existing category with the same name and gender
        const existingCategoryByName = await Category.findOne({
            gender: validatedData.gender,
            name: validatedData.name,
            _id: { $ne: id }, // Exclude the current category
        });

        if (existingCategoryByName) {
            throw new ApiError("A category with this name already exists for the specified gender", 409);
        }

        // Check for existing category with the same href and gender
        const existingCategoryByHref = await Category.findOne({
            gender: validatedData.gender,
            href: validatedData.href,
            _id: { $ne: id }, // Exclude the current category
        });

        if (existingCategoryByHref) {
            throw new ApiError("A category with this URL already exists for the specified gender", 409);
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(id, validatedData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation is run
        });

        if (!updatedCategory) {
            throw new ApiError("Category not found", 404);
        }

        return NextResponse.json(updatedCategory.toObject(), { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
// Routing Configuration
export const dynamic = "force-dynamic";
export const revalidate = 0;