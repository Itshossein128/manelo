import Image from "next/image";

export const AdminHeader = () => {
  return (
    <header className="flex items-center justify-between px-5">
      <div>
        <div className="flex items-center gap-3">
          <Image src={"/manelo-logo.png"} alt="" width={60.8} height={48}  />
          <Image src={"/manelo.png"} alt="" width={125} height={37.8} />
        </div>
        <div></div>
      </div>
    </header>
  );
};
