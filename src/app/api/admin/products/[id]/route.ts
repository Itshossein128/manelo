import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Product from "@/utils/models/Product";
import { ProductSchema, ProductInput, handleApiError, ApiError } from "@/utils/productUtils";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const product = await Product.findById(params.id).lean();
        if (!product) {
            throw new ApiError("Product not found", 404);
        }

        return NextResponse.json({ data: product }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = ProductSchema.parse(body) as ProductInput;

        // Check for existing product with the same name and gender (excluding the current product)
        const existingProduct = await Product.findOne({
            name: validatedData.name,
            gender: validatedData.gender,
            _id: { $ne: params.id }, // Exclude the current product
        });
        if (existingProduct) {
            throw new ApiError(
                "A product with this name already exists for the specified gender",
                409
            );
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            validatedData,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            throw new ApiError("Product not found", 404);
        }

        return NextResponse.json(updatedProduct.toObject(), { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const deletedProduct = await Product.findByIdAndDelete(params.id);
        if (!deletedProduct) {
            throw new ApiError("Product not found", 404);
        }

        return NextResponse.json(
            { message: "Product deleted successfully", data: deletedProduct },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}