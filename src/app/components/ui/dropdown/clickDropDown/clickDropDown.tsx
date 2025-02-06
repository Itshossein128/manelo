"use client";
import { ReactElement, useState } from "react";
import "@/app/components/ui/header/headerSearch";
import HeaderButtonDropDown from "../headerButtonDropDown/headerButtonDropDown";
type Tprops = {
  interactiveElement: ReactElement;
  containerClassName?: string;
};
export default function ClickDropDown({
  interactiveElement,
  containerClassName = "",
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
        className={`flex absolute z-10 top-[81px] left-0 h-[calc(100vh-110px)] bg-black/60 bg-opacity-90 items-start gap-5 w-full dropdown-container pointer-events-none opacity-0 transition  backdrop-blur-xs ${
          dropDown ? "opacity-100 [&>div]:pointer-events-auto" : ""
        } ${containerClassName}`}
      >
        <HeaderButtonDropDown
          title={`SEARCH`}
          setController={() => setDropDown(false)}
        />
      </div>
    </div>
  );
}
