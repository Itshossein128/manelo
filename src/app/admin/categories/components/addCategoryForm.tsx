import Select from "@/app/components/ui/select/select";
import { postAdminCategoryApi } from "@/app/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function AddCategoryForm() {
  const [name, setName] = useState<string>("");
  const [href, setHref] = useState<string>("");
  const [gender, setGender] = useState<string | undefined>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postAdminCategoryApi,
    onMutate: async (newCategory) => {
      // Cancel any ongoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Get the previous categories
      const previousCategories = queryClient.getQueryData(["categories"]);

      // Optimistically update the cache
      //   queryClient.setQueryData(["categories"], (old: any) => ({
      //     data: [...old.data, { ...newCategory, _id: Date.now().toString() }],
      //   }));

      // Return the previous categories for rollback on error
      //   return { previousCategories };
    },
    onError: (error, newCategory, context) => {
      // Rollback to the previous categories on error
      console.log(error);

      queryClient.setQueryData(["categories"], context?.previousCategories);
      toast.error(error.response.data.error);
    },
    onSuccess: (data) => {
      toast.success(`${data.name} category created successfully!`);
      setName("");
      setHref("");
      setGender(undefined);
    },
    onSettled: () => {
      // Refetch the categories query to ensure the data is up-to-date
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gender) {
      toast.error("Please select a gender");
      return;
    }
    mutation.mutate({ name, href, gender });
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-3 justify-center mt-5'>
      <input
        type='text'
        className='input input-bordered w-full max-w-xs'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Category Name'
      />
      <input
        type='text'
        className='input input-bordered w-full max-w-xs'
        value={href}
        onChange={(e) => setHref(e.target.value)}
        placeholder='Category URL'
      />
      <Select
        value={gender}
        setState={setGender}
        className='max-w-xs'
        options={[
          { label: "Women", value: "women" },
          { label: "Men", value: "men" },
        ]}
        placeHolder='Category Gender'
      />
      <button type='submit' className='btn w-36' disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
