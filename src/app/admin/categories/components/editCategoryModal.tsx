import Select from "@/app/components/ui/select/select";
import { putAdminCategoryApi } from "@/app/services/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { TCategory } from "./page";

interface TProps {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  category: TCategory;
}

export default function EditCategoryForm({
  category,
  isEditing,
  setIsEditing,
}: TProps) {
  const [name, setName] = useState<string>("");
  const [href, setHref] = useState<string>("");
  const [gender, setGender] = useState<string | undefined>("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      newCategoryData,
      categoryId,
    }: {
      newCategoryData: TCategory;
      categoryId: string;
    }) => putAdminCategoryApi(newCategoryData, categoryId),
    onMutate: async ({ newCategoryData, categoryId }) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);
      return { previousCategories };
    },
    onError: (error, { newCategoryData, categoryId }, context) => {
      console.log(error);
      queryClient.setQueryData(["categories"], context?.previousCategories);
      toast.error(error.response?.data?.error || "An error occurred");
    },
    onSuccess: (data) => {
      toast.success(`${data.name} category updated successfully!`);
      setName("");
      setHref("");
      setGender(undefined);
      setIsEditing(false); // Close the form after successful update
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  useEffect(() => {
    if (category) {
      setName(category.name);
      setHref(category.href);
      setGender(category.gender);
    }
  }, [category]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gender) {
      toast.error("Please select a gender");
      return;
    }
    mutation.mutate({
      newCategoryData: { name, href, gender },
      categoryId: category._id,
    });
  };

  return (
    <div
      className={`fixed left-0 top-0 flex items-center justify-center backdrop-blur-sm w-[100vw] h-[100vh] bg-slate-950/20 z-50 transition ${
        isEditing
          ? "opacity-100 pointer-events-auto"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className='p-10 rounded max-w-md w-full relative bg-white shadow-md'>
        <button
          className='btn btn-sm bg-white hover:bg-white shadow-none border-0 btn-circle absolute top-0 right-0 flex items-center justify-center'
          onClick={() => setIsEditing(false)}
        >
          <Image src={"/close-icon.svg"} width={18} height={18} alt='close' />
        </button>
        <form
          onSubmit={handleSubmit}
          className='flex gap-3 justify-center flex-col'
        >
          <input
            type='text'
            className='input input-bordered w-full'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Category Name'
          />
          <input
            type='text'
            className='input input-bordered w-full'
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder='Category URL'
          />
          <Select
            value={gender}
            setState={setGender}
            options={[
              { label: "Women", value: "women" },
              { label: "Men", value: "men" },
            ]}
            placeHolder='Category Gender'
          />
          <button
            type='submit'
            className='btn w-36'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Done"}
          </button>
        </form>
      </div>
    </div>
  );
}
