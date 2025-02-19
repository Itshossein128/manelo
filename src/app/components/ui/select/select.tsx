import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export type TOption = { label: string; value: string };

type TProps = {
  value?: string[];
  setState: Dispatch<SetStateAction<string[]>>;
  options: TOption[];
  placeHolder?: string;
  className?: string;
};

export default function Select({
  value = [],
  setState,
  options,
  placeHolder,
  className,
}: TProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      setState(value.filter((v) => v !== selectedValue));
    } else {
      setState([...value, selectedValue]);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`input input-bordered w-full flex items-center justify-start cursor-pointer relative ${
        showDropDown && "!border-gray-600"
      } ${className}`}
      onClick={() => setShowDropDown((prev) => !prev)}
    >
      <div className="flex flex-wrap gap-1">
        {value.length > 0 ? (
          value.map((val) => (
            <span key={val} className="bg-gray-200 px-2 py-1 rounded">
              {options.find((option) => option.value === val)?.label}
            </span>
          ))
        ) : (
          <span className="text-[#424242] text-opacity-55 select-none">
            {placeHolder}
          </span>
        )}
      </div>
      <Image
        width={24}
        height={24}
        src={"/angle-icon.svg"}
        alt=""
        className="absolute right-3 top-3"
      />
      {showDropDown && (
        <div className="border border-gray-400 rounded absolute top-full left-0 mt-1 bg-inherit w-full z-10">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b"
          />
          {filteredOptions.map((item) => (
            <div
              key={item.value}
              className={`hover:bg-tint-lightest hover:text-primary-dark font-semibold px-[22px] h-[29px] flex items-center ${
                value.includes(item.value) ? "bg-gray-200" : ""
              }`}
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
