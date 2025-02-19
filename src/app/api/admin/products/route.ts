import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Product from "@/utils/models/Product";
import { ProductSchema, ProductInput, handleApiError, ApiError } from "@/utils/productUtils";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        console.log("Request body:", body); // Log the request body for debugging

        // Validate the request body against the schema
        const validatedData = ProductSchema.parse(body) as ProductInput;

        // Check for existing product with the same name and gender
        const existingProduct = await Product.findOne({
            name: validatedData.name,
            gender: validatedData.gender,
        });
        if (existingProduct) {
            throw new ApiError(
                "A product with this name already exists for the specified gender",
                409
            );
        }

        // Transform the `colors` array into the required format
        const transformedData = {
            ...validatedData,
            colors: validatedData.colors.map(({ color }) => color),
            stock: validatedData.colors.reduce((acc, { color, stock }) => {
                acc[color] = parseInt(stock, 10); // Convert stock to number
                return acc;
            }, {} as Record<string, number>),
        };

        // Create and save the new product
        const newProduct = new Product(transformedData);
        await newProduct.save();

        return NextResponse.json(newProduct.toObject(), { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender"); // Optional: Filter by gender

        const query = gender ? { gender } : {};
        const products = await Product.find(query).lean();

        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}