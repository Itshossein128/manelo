import Image from "next/image";

export default function HeaderSearch() {
  return (
    <div className='w-[496px] z-10 max-w-[496px] absolute right-10 bg-white h-full'>
      <div className='h-full'>
        <div className='bg-tint-lightest p-[30px_30px_10px] flex items-center justify-between'>
          <h3 className=''>SEARCH</h3>
          <button className='cursor-pointer'>
            <Image
              width={24}
              height={24}
              src={"/close-icon.svg"}
              alt="close"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
