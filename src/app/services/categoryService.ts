import axios from "axios";
import { TCategory } from "../types/cateogy";

type TCategoryBody = Omit<TCategory, '_id'>

// server-side category fetch
export async function getServerCategories(options?: { revalidate?: number }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/categories`, {
        next: {
            revalidate: options?.revalidate ?? 60 // Default to 1 minute if not specified
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.data as TCategory[];
}

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
    console.log("res", response);

    return response.data;
};
