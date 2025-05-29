import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NavMenuDropDown({ categories, imgUrl }) {
  return (
    <div className='max-w-[815px] w-full rounded-sm bg-white p-5 flex items-start gap-5 font-normal'>
      <div className='grid grid-cols-[230px_230px] gap-x-5 *:py-4 *:leading-5 -my-4 text-subtitle-3 [&>a:hover]:text-primary-dark'>
        {categories.map(
          ({ name, href }: { name: string; href: string }, index: number) => {
            return (
              <Link
                key={index}
                href={href}
                className={`${
                  index < categories.length - 2 ? "border-b" : ""
                } border-gray`}
              >
                {name}
              </Link>
            );
          }
        )}
      </div>
      <div className='w-full'>
        <Image
          src={imgUrl}
          width={268}
          height={280}
          className='w-full'
          alt=''
        />
      </div>
    </div>
  );
}
