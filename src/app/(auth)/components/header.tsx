import Image from "next/image";

function Header() {
  return (
    <header className="flex justify-center p-5 shadow-md">
      <Image
        src={"/manelo.png"}
        width={71}
        height={56}
        alt=''
        className='w-30'
      />
    </header>
  );
}

export default Header;
