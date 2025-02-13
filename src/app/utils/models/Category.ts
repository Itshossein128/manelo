import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  href: string;
  gender: 'men' | 'women';
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  href: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ['men', 'women'] },
}, { timestamps: true });

CategorySchema.index({ gender: 1, name: 1 }, { unique: true });
CategorySchema.index({ gender: 1, href: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
