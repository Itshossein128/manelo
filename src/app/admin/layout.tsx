import LogoutButton from "../components/ui/auth/LogoutButton";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='p-5'>
      {children}
      <LogoutButton />
    </main>
  );
}
