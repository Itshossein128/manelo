"use client";
import { ReactElement, useState } from "react";
<<<<<<< HEAD:src/components/ui/dropdown/clickDropDown/clickDropDown.tsx
import "@/components/ui/header/headerSearch";
=======
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d:src/app/components/ui/dropdown/clickDropDown/clickDropDown.tsx
import HeaderButtonDropDown from "../headerButtonDropDown/headerButtonDropDown";
type Tprops = {
  interactiveElement: ReactElement;
  containerClassName?: string;
  dropDownContent: ReactElement;
};
export default function ClickDropDown({
  interactiveElement,
  containerClassName = "",
  dropDownContent,
}: Tprops) {
  const [dropDown, setDropDown] = useState(false);
  return (
    <div className='group'>
      <div
        className='cursor-pointer'
        onClick={() => setDropDown((prev) => !prev)}
      >
        {interactiveElement}
      </div>
      <div
        className={`flex absolute z-10 top-[81px] left-0 h-[calc(100vh-110px)] bg-slate-700/50 items-start gap-5 w-full dropdown-container pointer-events-none opacity-0 transition  backdrop-blur-[1.5px] ${
          dropDown ? "opacity-100 [&>div]:pointer-events-auto" : ""
        } ${containerClassName}`}
      >
        <HeaderButtonDropDown
          title={`SEARCH`}
          setController={() => setDropDown(false)}
        >
          {dropDownContent}
        </HeaderButtonDropDown>
      </div>
    </div>
  );
}
