import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8">
        <Image
          src="/manelo-logo.png"
          alt="Manelo Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
      {children}
    </div>
  );
}
