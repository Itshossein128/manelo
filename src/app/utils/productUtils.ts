import { NextResponse } from "next/server";
import { z } from "zod";

// Product schema for validation
export const ProductSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name cannot exceed 100 characters")
        .trim(),
    categories: z
        .array(z.string().min(1, "Category cannot be empty"))
        .min(1, "At least one category is required"),
    price: z
        .number()
        .min(0, "Price cannot be negative")
        .max(100000, "Price cannot exceed 100,000"),
    discountType: z.enum(["percentage", "fixed"], {
        errorMap: () => ({ message: "Discount type must be either 'percentage' or 'fixed'" }),
    }),
    discountValue: z
        .number()
        .min(0, "Discount value cannot be negative")
        .max(100000, "Discount value cannot exceed 100,000"),
    stock: z.record(z.number().min(0, "Stock cannot be negative")),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description cannot exceed 500 characters"),
    colors: z
        .array(z.string().min(1, "Color cannot be empty"))
        .min(1, "At least one color is required"),
    gender: z.enum(["men", "women"], {
        errorMap: () => ({ message: "Gender must be either 'men' or 'women'" }),
    }),
});

export type ProductInput = z.infer<typeof ProductSchema>;

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}

export function handleApiError(error: unknown): NextResponse {
    console.error("[API Error]:", error);

    let statusCode = 500;
    let errorMessage = "An unexpected error occurred";
    let errorDetails: any = null;

    if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        console.error("Validation errors:", error.errors); // Log validation errors for debugging
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
            errorMessage = "A product with this name already exists";
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

