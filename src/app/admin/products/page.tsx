"use client";

import AddProductForm from "./components/addProductForm";
import { useState } from "react";
import ProductsTable from "./components/productsTable";
import EditProductForm from "./components/editProductModal";

export type TProduct = {
  _id: string;
  name: string;
  category: string; // Assuming category is a string, you can adjust this based on your needs
  price: number;
  colors: { color: string; stock: number }[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  images: string[];
};

const Products = () => {
  const [editingProduct, setEditingProduct] = useState<TProduct | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Products Management</h1>
      <AddProductForm />
      <div className='overflow-x-auto mt-6'>
        <ProductsTable
          setIsEditing={setIsEditing}
          setEditingProduct={setEditingProduct}
        />
      </div>
      <EditProductForm
        product={editingProduct}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default Products;
