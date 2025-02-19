import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  categories: string[];
  price: number;
  discount: number;
  stock: number;
  description: string;
  colors: string[];
  sizes: string[];
  gender: "men" | "women";
  
}

export type ProductInput = {
  name: string;
  categories: string[];
  price: number;
  discount: number;
  stock: number;
  description: string;
  colors: string[];
  sizes: string[];
  gender: "men" | "women";
  
};