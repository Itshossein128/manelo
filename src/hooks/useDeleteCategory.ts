import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminCategoryApi } from "../services/category";
import { toast } from "react-toastify";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminCategoryApi,
    onMutate: async (id) => {
      // Cancel any ongoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Get the previous categories
      const previousCategories = queryClient.getQueryData(["categories"]);

      // Optimistically remove the category from the cache
      queryClient.setQueryData(["categories"], (old: any) => ({
        data: old.data.filter((category: any) => category._id !== id),
      }));

      // Return the previous categories for rollback on error
      return { previousCategories };
    },
    onError: (error, id, context) => {
      // Rollback to the previous categories on error
      queryClient.setQueryData(["categories"], context?.previousCategories);
      toast.error(error.response.data.error);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
    },
    // Remove the `onSettled` callback to prevent refetching
  });
};