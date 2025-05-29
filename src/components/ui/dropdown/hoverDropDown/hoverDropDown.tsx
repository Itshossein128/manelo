import "./hoverDropDown.css";
import { ReactElement } from "react";

type Tprops = {
  interactiveElement: ReactElement;
  dropDown: ReactElement;
  containerClassName?: string;
};
export default function HoverDropDown({
  interactiveElement,
  dropDown,
  containerClassName = "",
}: Tprops) {
  return (
    <div className='group'>
      <div className='cursor-pointer'>{interactiveElement}</div>
      <div
        className={`flex absolute z-20 top-[81px] left-0 h-[calc(100vh-110px)] bg-slate-700/50 items-start gap-5 w-full dropdown-container pointer-events-none opacity-0 transition group-hover:opacity-100 group-hover:[&>div]:pointer-events-auto backdrop-blur-[1.5px] ${containerClassName}`}
      >
        {dropDown}
      </div>
    </div>
  );
}
