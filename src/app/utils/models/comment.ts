import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  productId: string; // Reference to the product
  userId?: string; // Optional: Reference to the user (if authenticated)
  text: string; // The comment text
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    productId: { type: String, required: true }, // Reference to the product
    userId: { type: String }, // Optional: Reference to the user
    text: { type: String, required: true }, // The comment text
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);