// services/category.ts
import axios from "axios";
import { TCategory } from "../admin/categories/page";

type TCategoryBody = Omit<TCategory, '_id'>
// admin APIs
export const getAdminCategoryApi = async () => {
    const response = await axios.get("/api/admin/categories");
    return response.data;
};

export const postAdminCategoryApi = async (newCategory: TCategoryBody) => {
    const response = await axios.post("/api/admin/categories", newCategory);
    return response.data;
};
export const putAdminCategoryApi = async (newCategoryData: TCategoryBody, categoryId: string) => {
    const response = await axios.put(`/api/admin/categories?id=${categoryId}`, newCategoryData);
    return response.data;
};

export const deleteAdminCategoryApi = async (categoryId: string) => {
    const response = await axios.delete(`/api/admin/categories?id=${categoryId}`);
    return response.data;
};

//user Apis
export const getUserCategoryApi = async () => {
    const response = await axios.get("/api/user/categories");
    return response.data;
};
