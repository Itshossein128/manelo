import Image from "next/image";

export default function HeaderButtonDropDown({ title, setController }) {
  return (
    <div className='w-[496px] z-10 max-w-[496px] absolute right-10 bg-white h-full'>
      <div className='h-full'>
        <div className='bg-tint-lightest p-[30px_30px_10px] flex items-center justify-between'>
          <h3 className=''>{title}</h3>
          <button
            className='cursor-pointer'
            onClick={() => setController(false)}
          >
            <Image
              src={"./close-icon.svg"}
              width={24}
              height={24}
              alt='close'
            />
          </button>
        </div>
        <div>
          <div role='tablist' className='tabs tabs-lifted'>
            <a role='tab' className='tab'>
              Tab 1
            </a>
            <a role='tab' className='tab tab-active'>
              Tab 2
            </a>
            <a role='tab' className='tab'>
              Tab 3
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
