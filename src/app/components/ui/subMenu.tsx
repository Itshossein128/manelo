import Image from "next/image";
import Link from "next/link";

type Tprops = {
  categories: { title: string; href: string }[];
  imgUrl: string;
  className?: string;
};
export default function SubMenu({ categories, imgUrl, className }: Tprops) {
  return (
    <div
      className={
        "submenu-container pointer-events-none opacity-0 transition group-hover:opacity-100 flex absolute z-10 top-[110px] left-0 h-[calc(100vh-110px)] bg-black bg-opacity-90 items-start justify-center gap-5 w-full"
      }
      style={{ backdropFilter: "blur(1px)" }}
    >
      <div className='max-w-[815px] w-full border rounded bg-white p-5 flex items-start group-hover:pointer-events-auto gap-5 !font-normal'>
        <div className='grid grid-cols-[230px,230px] gap-x-5 *:py-4 *:leading-5 -my-4 text-subtitle-3 [&>a:hover]:text-primary-dark'>
          {categories.map(({ title, href }, index) => {
            return (
              <Link
                key={index}
                href={href}
                className={`${
                  index < categories.length - 2 ? "border-b" : ""
                } border-gray`}
              >
                {title}
              </Link>
            );
          })}
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
    </div>
  );
}
