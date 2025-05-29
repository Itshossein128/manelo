<<<<<<< HEAD
import { AdminHeader } from "./components/adminHeader";
import { AdminNavigation } from "./components/adminNavigation";
=======
import LogoutButton from "../components/ui/auth/LogoutButton";
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <div className="grid grid-cols-[auto_230px] min-h-dvh grid-rows-[65px_auto]">
      <AdminHeader />
      <AdminNavigation />
      <main className="border">{children}</main>
    </div>
=======
    <main className='p-5'>
      {children}
      <LogoutButton />
    </main>
>>>>>>> 604a5fc953563d3b3f26da11d335c99a9144a88d
  );
}
