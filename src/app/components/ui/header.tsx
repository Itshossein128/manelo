import Image from "next/image";
import Link from "next/link";
import SubMenu from "./subMenu";

export default function Header() {
  return (
    <header className='grid grid-cols-[1fr_auto_1fr] border-t-[29px] border-primary-dark border-b-[5px] py-[10px] px-[101px]'>
      <div className='flex gap-[19px] items-center'>
        <Image
          src={"/manelo-logo.png"}
          alt='manelo-logo'
          width={71}
          height={56}
        ></Image>
        <Image src={"/Manelo.png"} alt='Manelo' width={146} height={48}></Image>
      </div>
      <nav className='flex items-center'>
        <ul className='flex items-center gap-[7.5px] font-plus-jakarta-display [&>li>a]:py-2 [&>li>a]:px-3 font-medium text-lg'>
          <li className='group'>
            <Link
              className='border-b-4 border-transparent hover:text-primary-dark hover:border-primary-dark transition'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              WOMEN
            </Link>
            <SubMenu
              categories={[
                { title: "COATE & JACKETS", href: "test" },
                { title: "TOPS &BLOUSES", href: "test" },
                { title: "TRENCH COAT", href: "test" },
                { title: "SWEATSHIRTS", href: "test" },
                { title: "DRESSES", href: "test" },
                { title: "SKORTS", href: "test" },
                { title: "COLLECTION", href: "test" },
                { title: "JUMPSUIT", href: "test" },
                { title: "NEW ARRIVALS", href: "test" },
                { title: "PANTS & JEANS", href: "test" },
                { title: "ALL", href: "test" },
                { title: "COATS", href: "test" },
              ]}
              imgUrl='/woman-submenu.png'
            />
          </li>
          <li className='group'>
            <Link
              className='border-b-4 border-transparent hover:text-primary-dark hover:border-primary-dark transition'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              MEN
            </Link>
            <SubMenu
              categories={[
                { title: "COATE & JACKETS", href: "test" },
                { title: "TOPS &BLOUSES", href: "test" },
                { title: "TRENCH COAT", href: "test" },
                { title: "SWEATSHIRTS", href: "test" },
                { title: "DRESSES", href: "test" },
                { title: "SKORTS", href: "test" },
                { title: "COLLECTION", href: "test" },
                { title: "JUMPSUIT", href: "test" },
                { title: "NEW ARRIVALS", href: "test" },
                { title: "PANTS & JEANS", href: "test" },
                { title: "ALL", href: "test" },
                { title: "COATS", href: "test" },
              ]}
              imgUrl='/man-submenu.png'
            />
          </li>
          <li>
            <Link
              className=' border-b-4 border-transparent hover:text-primary-dark hover:border-primary-dark transition'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              PRODUCT
            </Link>
          </li>
          <li>
            <Link
              className=' border-b-4 border-transparent hover:text-primary-dark hover:border-primary-dark transition'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              JOURNAL
            </Link>
          </li>
          <li>
            <Link
              className=' border-b-4 border-transparent hover:text-primary-dark hover:border-primary-dark transition'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              ABOUT
            </Link>
          </li>
        </ul>
      </nav>
      <div className='flex items-center justify-end gap-[18px]'>
        <div>
          <Image
            src={"/search-icon.svg"}
            alt='search'
            width={36}
            height={36}
          ></Image>
        </div>
        <div>
          <Image
            src={"/person-icon.svg"}
            alt='search'
            width={36}
            height={36}
          ></Image>
        </div>
        <div>
          <Image
            src={"/gift-icon.svg"}
            alt='search'
            width={36}
            height={36}
          ></Image>
        </div>
        <div>
          <Image
            src={"/bag-icon.svg"}
            alt='search'
            width={36}
            height={36}
          ></Image>
        </div>
      </div>
    </header>
  );
}
