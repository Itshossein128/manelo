"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TProduct } from "../page";
import axios from "axios";

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
    queryFn: async () => {
      const response = await axios.get("/api/admin/products");
      console.log("data", response.data);

      return response.data;
    },
  });

  // Delete product mutation
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
          <th className='p-3 text-left'>Name</th>
          <th className='p-3 text-left'>Category</th>
          <th className='p-3 text-left'>Price</th>
          <th className='p-3 text-left'>Stock</th>
          <th className='p-3 text-left'>Description</th>
          <th className='p-3 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length &&
          products.map((product) => (
            <tr key={product._id} className='border-t'>
              <td className='p-3'>{product.name}</td>
              <td className='p-3'>{product.category}</td>
              <td className='p-3'>${product.price}</td>
              <td className='p-3'>{product.stock}</td>
              <td className='p-3'>{product.description}</td>
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
          ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
