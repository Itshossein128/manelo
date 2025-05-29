"use client";
import { useEffect, useState } from "react";
import Select from "../select/select";
import { useQuery } from "@tanstack/react-query";
import { getAdminCategoryApi } from "@/services/categoryService";
import Image from "next/image";
import Link from "next/link";

export default function HeaderSearch() {
  const [gender, setGender] = useState<"women" | "men">("women");
  const [category, setCategory] = useState<string[]>([]);
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", gender],
    queryFn: async () => {
      const response = await getAdminCategoryApi();
      return response.data
        .filter((category: any) => category.gender === gender)
        .map((category: any) => ({
          label: category.name,
          value: category.href,
        }));
    },
  });

  return (
    <div className='mt-1'>
      <div
        role='tablist'
        className='tabs tabs-lifted [&>a.tab-active]:!rounded bg-tint-lightest grid-cols-2'
      >
        <a
          role='tab'
          className={`tab flex items-center justify-center h-auto ${
            gender === "women" && "tab-active border-b border-b-primary-dark"
          }`}
          onClick={() => setGender("women")}
        >
          <span className='font-bold text-h4 block'>Women</span>
        </a>
        <a
          role='tab'
          className={`tab flex items-center justify-center h-auto ${
            gender === "men" && "tab-active border-b border-b-primary-dark"
          }`}
          onClick={() => setGender("men")}
        >
          <span className='font-bold text-h4 block'>Men</span>
        </a>
      </div>
      <div className='p-[24px_30px]'>
        <div>
          <label className='input input-bordered flex items-center gap-2 mb-4'>
            <input type='text' className='grow' placeholder='Search' />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'
            >
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
          </label>
          <Select
            options={categories || [{ label: "", value: "" }]}
            setState={setCategory}
            value={category}
            placeHolder='All Categories'
            className='mb-6'
          />
        </div>
        <span>Need Some inspiration?</span>
        <div role='tabContent' className='border-t border-gray-200 mt-2 pt-6'>
          <div className='flex gap-4 p-3 border border-gray-400'>
            <div>
              <Image
                src={"/man-submenu.png"}
                width={100}
                height={100}
                alt='man'
              />
            </div>
            <div className='flex justify-end flex-col'>
              <span>OverSized Coat</span>
              <span>
                <span className='line-through'>$563.00</span>
                <span>$363.00</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 left-0 p-[15px_22px] bg-[#f5f5f5] w-full'>
        <Link href={"/"} className='inline-flex items-center gap-2 py-1'>
          <span>View All (12)</span>
          <Image
            src={"/arrow-forward.svg"}
            width={24}
            height={24}
            alt='arrow'
          />
        </Link>
      </div>
    </div>
  );
}
