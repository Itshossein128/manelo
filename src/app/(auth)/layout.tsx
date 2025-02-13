import Header from "./components/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='min-h-[calc(100vh-57px)] max-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-100'>
        {children}
      </main>
    </>
  );
}
