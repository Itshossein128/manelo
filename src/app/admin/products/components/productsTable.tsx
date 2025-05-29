"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TProduct } from "../page";
import axios from "axios";
import Image from "next/image";
import { getAdminProductsApi } from "@/app/services/productService";

type ProductsTableProps = {
  setIsEditing: (isEditing: boolean) => void;
  setEditingProduct: (product: TProduct) => void;
};

const ProductsTable = ({
  setIsEditing,
  setEditingProduct,
}: ProductsTableProps) => {
  const queryClient = useQueryClient();

  // Fetch products using React Query
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<TProduct[]>({
    queryKey: ["products"],
    queryFn: () => getAdminProductsApi(),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the products query to refetch data
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching products</div>;
  }

  return (
    <table className='min-w-full bg-white border rounded-lg overflow-hidden'>
      <thead className='bg-gray-100'>
        <tr>
          <th className='p-3 text-left'>Image</th>
          <th className='p-3 text-left'>Name</th>
          <th className='p-3 text-left'>Category</th>
          <th className='p-3 text-left'>Price</th>
          <th className='p-3 text-left'>Stock</th>
          <th className='p-3 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products?.data &&
          products?.data.length > 0 &&
          products?.data.map((product: TProduct) => {
            return (
              <tr key={product._id} className='border-t'>
                <td className='p-3'>
                  {product.images && product.images.length > 0 ? (
                    <div className='relative w-16 h-16'>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}${product.images[0]}`}
                        alt={product.name}
                        fill
                        className='object-cover rounded'
                      />
                    </div>
                  ) : (
                    <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center'>
                      <span className='text-gray-500 text-xs'>No image</span>
                    </div>
                  )}
                </td>
                <td className='p-3'>{product.name}</td>
                <td className='p-3'>
                  {product.categories.map((category: string) => (
                    <span key={category}>{category}</span>
                  ))}
                </td>
                <td className='p-3'>${product.price}</td>
                <td className='p-3'>
                  <div className='grid grid-cols-2'>
                    {product.colors.map(({ color, stock }) => {
                      return (
                        <div key={color} className='flex items-center gap-2'>
                          {stock}
                          <div
                            className='w-5 h-5 rounded-sm'
                            style={{ background: color }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className='p-3 flex gap-2'>
                  <button
                    onClick={() => handleEdit(product)}
                    className='bg-yellow-500 text-white px-3 py-1 rounded'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className='bg-red-500 text-white px-3 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default ProductsTable;
