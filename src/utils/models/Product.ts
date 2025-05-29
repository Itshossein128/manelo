import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    categories: string[];
    price: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
    stock: Record<string, number>;
    description: string;
    colors: string[];
    gender: 'men' | 'women';
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    categories: { type: [String], required: true },
    price: { type: Number, required: true },
    discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
    discountValue: { type: Number, required: true },
    stock: { type: Map, of: Number, required: true },
    description: { type: String, required: true },
    colors: { type: [String], required: true },
    gender: { type: String, required: true, enum: ['men', 'women'] },
}, { timestamps: true });

ProductSchema.index({ gender: 1, name: 1 }, { unique: true });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
