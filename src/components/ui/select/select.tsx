import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

export type TOption = { label: string; value: string };

type TProps = {
  value?: string[];
  setState: Dispatch<SetStateAction<string[]>>;
  options: TOption[];
  placeHolder?: string;
  className?: string;
  enableSearch?: boolean;
  isMultiSelect?: boolean; // Add a prop to enable/disable multiselect
};

export default function Select({
  value = [],
  setState,
  options,
  placeHolder,
  className,
  enableSearch = true,
  isMultiSelect = true, // Default to true for backward compatibility
}: TProps) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
    if (isMultiSelect) {
      // Multiselect logic
      if (value.includes(selectedValue)) {
        setState(value.filter((v) => v !== selectedValue));
      } else {
        setState([...value, selectedValue]);
      }
    } else {
      // Single-select logic
      setState([selectedValue]);
      setShowDropDown(false); // Close dropdown after selection
    }
  };

  const handleToggleDropdown = () => {
    if (!isDragging) {
      setShowDropDown((prev) => !prev);
    }
  };

  const handleRemove = (selectedValue: string) => {
    setState(value.filter((v) => v !== selectedValue));
  };

  return (
    <div
      ref={dropdownRef}
      className={`input input-bordered w-full flex items-center justify-start cursor-pointer relative ${
        showDropDown && "border-gray-600!"
      } ${className}`}
      onClick={handleToggleDropdown}
    >
      <ScrollContainer
        className='scroll-container mr-5'
        onScroll={() => setIsDragging(true)}
      >
        <div
          className='flex flex-nowrap whitespace-nowrap gap-1'
          onMouseUp={() => setIsDragging(false)}
        >
          {value.length > 0 ? (
            value.map((val) => (
              <span
                key={val}
                className='bg-gray-200 px-2 py-1 rounded flex items-center gap-1'
              >
                {options.find((option) => option.value === val)?.label}
                {isMultiSelect && ( // Only show remove button in multiselect mode
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(val);
                    }}
                    className='text-red-500 hover:text-red-700'
                  >
                    &times;
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className='text-[#424242] text-opacity-55 select-none'>
              {placeHolder}
            </span>
          )}
        </div>
      </ScrollContainer>

      <Image
        width={24}
        height={24}
        src={"/angle-icon.svg"}
        alt=''
        className='absolute right-3 top-3'
      />
      {showDropDown && (
<<<<<<< HEAD:src/components/ui/select/select.tsx
        <div className='border border-gray-400 rounded-sm absolute top-full left-0 mt-1 bg-inherit w-full z-10'>
          {options.map((item) => (
=======
        <div className='border border-gray-400 rounded absolute top-full left-0 mt-1 bg-inherit w-full z-10'>
          {enableSearch && (
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full p-2 border-b'
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {filteredOptions.map((item) => (
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d:src/app/components/ui/select/select.tsx
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