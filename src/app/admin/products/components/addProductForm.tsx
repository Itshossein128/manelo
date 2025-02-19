"use client"; // Required for Editor.js to work in Next.js

import { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import DOMPurify from "dompurify";
import type { OutputData } from "@editorjs/editorjs";
import Select, { TOption } from "@/components/ui/select/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import InputField from "./InputField";

interface ProductState {
  name: string;
  categories: string[];
  price: string; // Change to string to handle empty input
  stock: Record<string, string>; // Change to string to handle empty input
  description: OutputData | null;
  colors: { color: string; stock: string }[]; // Updated to include color and stock
  discountType: "percentage" | "fixed";
  discountValue: string; // Change to string to handle empty input
  gender: "women" | "men";
}

const categoriesOptions: TOption[] = [
  { label: "Category 1", value: "category1" },
  { label: "Category 2", value: "category2" },
  // ...other categories
];

const AddProductForm = () => {
  const [product, setProduct] = useState<ProductState>({
    name: "",
    categories: [],
    price: "", // Initialize as empty string
    stock: {},
    description: null,
    colors: [{ color: "#000000", stock: "" }], // Default black color with empty stock
    discountType: "percentage",
    discountValue: "", // Initialize as empty string
    gender: "men",
  });

  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductState) => {
      const response = await axios.post("/api/admin/products", {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0, // Convert to number
        discountValue: parseFloat(newProduct.discountValue) || 0, // Convert to number
        stock: Object.fromEntries(
          newProduct.colors.map(({ color, stock }) => [color, parseInt(stock) || 0])
        ), // Convert stock values to numbers
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            embed: Embed,
          },
          placeholder: "Write your product description here...",
          async onChange(api) {
            const data = await api.saver.save();
            setProduct((prev) => ({ ...prev, description: data }));
          },
        });
        editorRef.current = editor;
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedDescription = DOMPurify.sanitize(
      JSON.stringify(product.description)
    );

    const productData: ProductState = {
      ...product,
      description: JSON.parse(sanitizedDescription) as OutputData,
    };

    addProductMutation.mutate(productData);
  };


  const handleInputField = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof ProductState
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setProduct({ ...product, [key]: value });
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const updatedColors = [...product.colors];
    updatedColors[index].color = color;
    setProduct({ ...product, colors: updatedColors });
  };

  const handleStockChange = (index: number, stock: string) => {
    const updatedColors = [...product.colors];
    updatedColors[index].stock = stock;
    setProduct({ ...product, colors: updatedColors });
  };

  const addColorField = () => {
    setProduct({
      ...product,
      colors: [...product.colors, { color: "#000000", stock: "" }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          title="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Product Name"
          className="p-2 border rounded"
        />
        <Select
          value={product.categories}
          setState={(value) => setProduct({ ...product, categories: typeof value === 'function' ? value(product.categories) : value })}
          options={categoriesOptions}
          placeHolder="Select Categories"
          className="p-2 border rounded"
        />
        <InputField
          title="Price"
          value={product.price}
          onChange={(e) => handleInputField(e, "price")}
          placeholder="Price"
          className="p-2 border rounded"
        />
        {product.colors.map(({ color, stock }, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-10 h-10"
            />
            <InputField
              title={`Stock for ${color}`}
              value={stock}
              onChange={(e) => handleStockChange(index, e.target.value)}
              placeholder={`Stock for ${color}`}
              className="p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addColorField}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Color
        </button>
        <div className="col-span-2">
          <div id="editorjs" className="bg-white p-4 border rounded" />
        </div>
        <div className="col-span-2 flex gap-4">
          <select
            value={product.discountType}
            onChange={(e) =>
              setProduct({
                ...product,
                discountType: e.target.value as "percentage" | "fixed",
              })
            }
            className="p-2 border rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <InputField
            title="Discount Value"
            value={product.discountValue}
            onChange={(e) => handleInputField(e, "discountValue")}
            placeholder="Discount Value"
            className="p-2 border rounded"
          />
          <select
            value={product.gender}
            onChange={(e) =>
              setProduct({
                ...product,
                gender: e.target.value as "women" | "men",
              })
            }
            className="p-2 border rounded"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;