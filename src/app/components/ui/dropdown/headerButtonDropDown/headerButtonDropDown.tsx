"use client";
import Image from "next/image";
import { useState } from "react";

export default function HeaderButtonDropDown({ title, setController }) {
  const [gender, setGender] = useState<"women" | "men">("women");
  return (
    <div className='w-[496px] z-10 max-w-[496px] absolute right-10 bg-white h-full'>
      <div className='h-full'>
        <div className='bg-tint-lightest p-[30px_30px_10px] flex items-center justify-between'>
          <h3 className=''>{title}</h3>
          <button
            className='cursor-pointer'
            onClick={() => setController(false)}
          >
            <Image src={"/close-icon.svg"} width={24} height={24} alt='close' />
          </button>
        </div>
        <div className='mt-1'>
          <div
            role='tablist'
            className='tabs tabs-lifted [&>a.tab-active]:!rounded bg-tint-lightest grid-cols-2'
          >
            <a
              role='tab'
              className={`tab flex items-center justify-center h-auto ${
                gender === "women" &&
                "tab-active border-b border-b-primary-dark"
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
          <div>
            <label className='input input-bordered flex items-center gap-2'>
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
          </div>
          <div role='tabContent'>
            {gender === "women" ? <div>Women</div> : <div>Men</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
