import { useState } from "react";
import { TProduct } from "../page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ImageUpload from './ImageUpload';

type EditProductFormProps = {
  product: TProduct | undefined;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

const EditProductForm = ({
  product,
  isEditing,
  setIsEditing,
}: EditProductFormProps) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [newImages, setNewImages] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const editProductMutation = useMutation({
    mutationFn: async (updatedProduct: TProduct) => {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add all new images
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      // Add other product data including existing images
      formData.append('data', JSON.stringify(updatedProduct));

      const response = await axios.put(
        `/api/admin/products/${updatedProduct._id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      editProductMutation.mutate(editedProduct);
      setIsEditing(false);
    }
  };

  const handleImagesChange = (files: File[]) => {
    setNewImages(prev => [...prev, ...files]);
  };

  if (!isEditing || !editedProduct) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              placeholder='Product Name'
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
              className='p-2 border rounded'
            />
            <input
              type='text'
              placeholder='Category'
              value={editedProduct.category}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, category: e.target.value })
              }
              className='p-2 border rounded'
            />
            <input
              type='number'
              placeholder='Price'
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className='p-2 border rounded'
            />
            <input
              type='number'
              placeholder='Stock'
              value={editedProduct.stock}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  stock: parseInt(e.target.value),
                })
              }
              className='p-2 border rounded'
            />
            <textarea
              placeholder='Description'
              value={editedProduct.description}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  description: e.target.value,
                })
              }
              className='p-2 border rounded col-span-2'
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <ImageUpload 
                onImagesChange={handleImagesChange}
                existingImages={editedProduct.images || []}
              />
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <button
              type='button'
              onClick={() => setIsEditing(false)}
              className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
