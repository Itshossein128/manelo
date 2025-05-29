import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export type TOption = { label: string; value: string };

type TProps = {
  value?: string;
  setState: Dispatch<SetStateAction<string | undefined>>;
  options: TOption[];
  placeHolder?: string;
  className?: string;
};

export default function Select({
  value,
  setState,
  options,
  placeHolder,
  className,
}: TProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const preSelected = value
    ? options.find((option) => option.value === value)
    : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      ref={dropdownRef}
      className={`input input-bordered w-full flex items-center justify-start cursor-pointer relative ${
        showDropDown && "border-gray-600!"
      } ${className}`}
      onClick={() => setShowDropDown((prev) => !prev)}
    >
      {preSelected?.label || (
        <span className='text-[#424242] text-opacity-55 select-none'>
          {placeHolder}
        </span>
      )}
      <Image
        width={24}
        height={24}
        src={"/angle-icon.svg"}
        alt=''
        className='absolute right-3 top-3'
      />
      {showDropDown && (
        <div className='border border-gray-400 rounded-sm absolute top-full left-0 mt-1 bg-inherit w-full z-10'>
          {options.map((item) => (
            <div
              key={item.value}
              className='hover:bg-tint-lightest hover:text-primary-dark font-semibold px-[22px] h-[29px] flex items-center'
              onClick={() => setState(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
