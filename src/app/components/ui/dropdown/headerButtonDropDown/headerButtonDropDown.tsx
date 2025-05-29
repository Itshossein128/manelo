"use client";
import { timesNewRoman } from "@/app/utils/fonts";
import Image from "next/image";
import { useState } from "react";

export default function HeaderButtonDropDown({
  title,
  setController,
  children,
}) {
  return (
    <div className='w-[496px] z-10 max-w-[496px] absolute right-10 bg-white h-full'>
      <div className='h-full'>
      <div className='bg-tint-lightest p-[30px_30px_10px] flex items-center justify-between'>
        <h3 className={timesNewRoman.className}>{title}</h3>
        <button className='cursor-pointer' onClick={() => setController(false)}>
          <Image src={"/close-icon.svg"} width={24} height={24} alt='close' />
        </button>
      </div>
        {children}
      </div>
    </div>
  );
}
