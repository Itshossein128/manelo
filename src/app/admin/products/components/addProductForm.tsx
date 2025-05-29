"use client";

import { useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import Select, { TOption } from "@/components/ui/select/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import InputField from "./InputField";
import DOMPurify from "dompurify";
import ClientEditor from "./ClientEditor";
import ImageUpload from "./ImageUpload";
import {
  getAdminCategoryApi,
  getUserCategoryApi,
} from "@/app/services/categoryService";

interface ProductState {
  name: string;
  categories: string[];
  price: string;
  description: OutputData | null;
  colors: { color: string; stock: string }[];
  discountType: "percentage" | "fixed";
  discountValue: string;
  gender: "women" | "men";
  images: File[];
}

interface FormErrors {
  name?: string;
  categories?: string;
  price?: string;
  colors?: string;
  description?: string;
  submit?: string;
  images?: string;
}

const categoriesOptions: TOption[] = [
  { label: "Category 1", value: "category1" },
  { label: "Category 2", value: "category2" },
];

const AddProductForm = () => {
  const [product, setProduct] = useState<ProductState>({
    name: "",
    categories: [],
    price: "",
    description: null,
    colors: [{ color: "#000000", stock: "" }],
    discountType: "percentage",
    discountValue: "",
    gender: "men",
    images: [],
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getUserCategoryApi();
      console.log(response);

      // return response.map(item => { value: item.name, label: item.href });
    },
  });
  console.log(categories);

  const [errors, setErrors] = useState<FormErrors>({});
  const queryClient = useQueryClient();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (product.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    if (!product.price || parseFloat(product.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!product.colors.every(({ stock }) => stock && parseInt(stock) >= 0)) {
      newErrors.colors = "Valid stock quantity is required for all colors";
    }

    if (!product.description) {
      newErrors.description = "Product description is required";
    }

    if (product.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProductMutation = useMutation<any, Error, ProductState>({
    mutationFn: async (newProduct: ProductState) => {
      if (!validateForm()) {
        throw new Error("Please fix the form errors");
      }

      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all images
      newProduct.images.forEach((file) => {
        formData.append("images", file);
      });

      // Add other product data
      formData.append(
        "data",
        JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          discountValue: parseFloat(newProduct.discountValue) || 0,
        })
      );

      const response = await axios.post("/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProduct({
        name: "",
        categories: [],
        price: "",
        description: null,
        colors: [{ color: "#000000", stock: "" }],
        discountType: "percentage",
        discountValue: "",
        gender: "men",
        images: [],
      });
    },
    onError: (error: Error) => {
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    },
  });

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

  const handleEditorChange = (data: OutputData) => {
    setProduct((prev) => ({ ...prev, description: data }));
  };

  const addColorField = () => {
    setProduct({
      ...product,
      colors: [...product.colors, { color: "#000000", stock: "" }],
    });
  };

  const handleImagesChange = (files: File[]) => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Add New Product</h2>
      {addProductMutation.isError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {errors.submit}
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <InputField
            title='Product Name'
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder='Product Name'
            className={`p-2 border rounded ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <span className='text-red-500 text-sm'>{errors.name}</span>
          )}
        </div>

        <div>
          <Select
            value={product.categories}
            setState={(value) =>
              setProduct({
                ...product,
                categories:
                  typeof value === "function"
                    ? value(product.categories)
                    : value,
              })
            }
            options={categoriesOptions}
            placeHolder='Select Categories'
            className={`p-2 border rounded ${
              errors.categories ? "border-red-500" : ""
            }`}
          />
          {errors.categories && (
            <span className='text-red-500 text-sm'>{errors.categories}</span>
          )}
        </div>

        <div>
          <InputField
            title='Price'
            value={product.price}
            onChange={(e) => handleInputField(e, "price")}
            placeholder='Price'
            className={`p-2 border rounded ${
              errors.price ? "border-red-500" : ""
            }`}
          />
          {errors.price && (
            <span className='text-red-500 text-sm'>{errors.price}</span>
          )}
        </div>

        {product.colors.map(({ color, stock }, index) => (
          <div key={index} className='flex gap-2 items-center'>
            <input
              type='color'
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className='w-10 h-10'
            />
            <InputField
              title={`Stock for ${color}`}
              value={stock}
              onChange={(e) => handleStockChange(index, e.target.value)}
              placeholder={`Stock for ${color}`}
              className='p-2 border rounded'
            />
          </div>
        ))}
        <button
          type='button'
          onClick={addColorField}
          className='mt-2 bg-green-500 text-white px-4 py-2 rounded'
        >
          Add Color
        </button>
        <div className='col-span-2'>
          <ClientEditor
            onChange={handleEditorChange}
            hasError={!!errors.description}
          />
          {errors.description && (
            <span className='text-red-500 text-sm'>{errors.description}</span>
          )}
        </div>
        <div className='col-span-2'>
          <h3 className='text-lg font-medium mb-2'>Product Images</h3>
          <ImageUpload
            onImagesChange={handleImagesChange}
            error={errors.images}
          />
        </div>
        <div className='col-span-2 flex gap-4'>
          <select
            value={product.discountType}
            onChange={(e) =>
              setProduct({
                ...product,
                discountType: e.target.value as "percentage" | "fixed",
              })
            }
            className='p-2 border rounded'
          >
            <option value='percentage'>Percentage</option>
            <option value='fixed'>Fixed Amount</option>
          </select>
          <InputField
            title='Discount Value'
            value={product.discountValue}
            onChange={(e) => handleInputField(e, "discountValue")}
            placeholder='Discount Value'
            className='p-2 border rounded'
          />
          <select
            value={product.gender}
            onChange={(e) =>
              setProduct({
                ...product,
                gender: e.target.value as "women" | "men",
              })
            }
            className='p-2 border rounded'
          >
            <option value='women'>Women</option>
            <option value='men'>Men</option>
          </select>
        </div>
      </div>
      <button
        type='submit'
        className={`mt-4 px-4 py-2 rounded ${
          addProductMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        disabled={addProductMutation.isPending}
      >
        {addProductMutation.isPending ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
