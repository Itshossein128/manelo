import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import client from "@/utils/db";
import { handleApiError } from "@/utils/productUtils";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
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
                return `${uniqueFilename}`;
            })
        );

        // Add image URLs to product data
        const finalProductData = {
            ...productData,
            images: imageUrls,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // TODO: Save product data to your database
        const db = client.db();
        await db.collection('products').insertOne(finalProductData);

        return NextResponse.json(finalProductData, { status: 201 });
    } catch (error) {
        console.error('Error in product creation:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const db = client.db();
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get("gender");

        const query = gender ? { gender } : {};
        const products = await db.collection('products').find(query).toArray();

        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}