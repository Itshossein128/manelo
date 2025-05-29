import { NextRequest, NextResponse } from "next/server";
import client from "@/utils/db";
import { ProductSchema, ProductInput, handleApiError, ApiError } from "@/utils/productUtils";
import { ObjectId } from "mongodb";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = client.db();
        const product = await db.collection('products').findOne({
            _id: new ObjectId(params.id)
        });

        if (!product) {
            throw new ApiError("Product not found", 404);
        }

        return NextResponse.json({ data: product }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await req.formData();
        const images = formData.getAll('images') as File[];
        const productData = JSON.parse(formData.get('data') as string);

        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public/uploads');
        try {
            await writeFile(join(uploadDir, '.gitkeep'), '');
        } catch (error) {
            console.error('Error creating uploads directory:', error);
        }

        // Handle image uploads
        const imageUrls = await Promise.all(
            images.map(async (image) => {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Create unique filename
                const uniqueFilename = `${uuidv4()}-${image.name}`;
                const filePath = join(uploadDir, uniqueFilename);
                
                // Write file
                await writeFile(filePath, buffer);
                
                // Return the public URL
                return `/uploads/${uniqueFilename}`;
            })
        );

        // Combine existing images with new ones
        const updatedProductData = {
            ...productData,
            images: [...(productData.images || []), ...imageUrls],
            updatedAt: new Date(),
        };

        const db = client.db();
        const result = await db.collection('products').updateOne(
            { _id: params.id },
            { $set: updatedProductData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedProductData, { status: 200 });
    } catch (error) {
        console.error('Error in product update:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = client.db();
        const result = await db.collection('products').deleteOne({ _id: params.id });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}