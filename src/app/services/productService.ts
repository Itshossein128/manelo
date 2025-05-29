import axios from "axios";
import { TProduct } from "../admin/products/page";

type TProductBody = Omit<TProduct, '_id'>
// admin APIs
export const getAdminCategoryApi = async () => {
    const response = await axios.get("/api/admin/categories");
    return response.data;
};

export const postAdminCategoryApi = async (newCategory: TProductBody) => {
    const response = await axios.post("/api/admin/categories", newCategory);
    return response.data;
};
export const putAdminCategoryApi = async (newCategoryData: TProductBody, categoryId: string) => {
    const response = await axios.put(`/api/admin/categories?id=${categoryId}`, newCategoryData);
    return response.data;
};

export const deleteAdminCategoryApi = async (categoryId: string) => {
    const response = await axios.delete(`/api/admin/categories?id=${categoryId}`);
    return response.data;
};

// admin APIs for products
export const getAdminProductsApi = async (gender?: string) => {
    const url = gender ? `/api/admin/products${gender}` : "/api/admin/products";
    const response = await axios.get(url);
    return response.data;
};

export const getAdminProductByIdApi = async (productId: string) => {
    const response = await axios.get(`/api/admin/products/${productId}`);
    return response.data;
};

export const postAdminProductApi = async (productData: FormData) => {
    const response = await axios.post("/api/admin/products", productData);
    return response.data;
};

export const putAdminProductApi = async (productData: FormData, productId: string) => {
    const response = await axios.put(`/api/admin/products/${productId}`, productData);
    return response.data;
};

export const deleteAdminProductApi = async (productId: string) => {
    const response = await axios.delete(`/api/admin/products/${productId}`);
    return response.data;
};

//user Apis
export const getUserCategoryApi = async () => {
    const response = await axios.get("/api/user/categories");
    return response.data;
};

// user APIs for products
export const getUserProductsApi = async (gender?: string) => {
    const url = gender ? `/api/user/products?gender=${gender}` : "/api/user/products";
    const response = await axios.get(url);
    return response.data;
};

export const getUserProductByIdApi = async (productId: string) => {
    const response = await axios.get(`/api/user/products/${productId}`);
    return response.data;
};
