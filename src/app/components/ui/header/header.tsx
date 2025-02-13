"use client";
import Image from "next/image";
import Link from "next/link";
import HoverDropDown from "../dropdown/hoverDropDown/hoverDropDown";
import NavMenuDropDown from "../dropdown/navMenuDropDown/navMenuDropDown";
import ClickDropDown from "../dropdown/clickDropDown/clickDropDown";
import { useEffect, useState } from "react";
import { getUserCategoryApi } from "@/app/services/category";
import { TCategory } from "@/app/dashboard/categories/page";

export default function Header() {
  const [menCategories, setMenCategories] = useState<TCategory[]>([]);
  const [womenCategories, setWomenCategories] = useState<TCategory[]>([]);
  useEffect(() => {
    getUserCategoryApi().then((res) => {
      setMenCategories(
        res.data.filter((category: TCategory) => category.gender === "men")
      );
      setWomenCategories(
        res.data.filter((category: TCategory) => category.gender === "women")
      );
    });
  }, []);

  return (
    <header className='sticky top-0 z-10 bg-white shadow-md grid grid-cols-[1fr_auto_1fr] border-t-[29px] border-primary-dark border-b-[5px] py-[10px] px-[101px]'>
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
        <ul className='flex items-center gap-[7.5px] font-plus-jakarta-display [&_a:not(.dropdown-container_a)]:py-2 [&_a:not(.dropdown-container_a)]:px-3 font-medium text-lg'>
          <li>
            <HoverDropDown
              containerClassName='justify-center'
              interactiveElement={
                <Link
                  className='nav-link'
                  style={{ transitionProperty: "border-color" }}
                  href={"#"}
                >
                  WOMEN
                </Link>
              }
              dropDown={
                <NavMenuDropDown
                  categories={womenCategories}
                  imgUrl={"/woman-submenu.png"}
                />
              }
            />
          </li>
          <li>
            <HoverDropDown
              containerClassName='justify-center'
              interactiveElement={
                <Link
                  className='nav-link'
                  style={{ transitionProperty: "border-color" }}
                  href={"#"}
                >
                  MEN
                </Link>
              }
              dropDown={
                <NavMenuDropDown
                  categories={menCategories}
                  imgUrl={"/man-submenu.png"}
                />
              }
            />
          </li>
          <li>
            <Link
              className=' nav-link'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              PRODUCT
            </Link>
          </li>
          <li>
            <Link
              className=' nav-link'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              JOURNAL
            </Link>
          </li>
          <li>
            <Link
              className=' nav-link'
              style={{ transitionProperty: "border-color" }}
              href={"#"}
            >
              ABOUT
            </Link>
          </li>
        </ul>
      </nav>
      <div className='flex items-center justify-end gap-[18px]'>
        <ClickDropDown
          interactiveElement={
            <Image
              src={"/search-icon.svg"}
              alt='search'
              width={36}
              height={36}
            />
          }
        />

        <ClickDropDown
          interactiveElement={
            <Image
              src={"/person-icon.svg"}
              alt='search'
              width={36}
              height={36}
            ></Image>
          }
        />

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
