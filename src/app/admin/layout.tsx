import { AdminHeader } from "./components/adminHeader";
import { AdminNavigation } from "./components/adminNavigation";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[auto_230px] min-h-dvh grid-rows-[65px_auto]">
      <AdminHeader />
      <AdminNavigation />
      <main className="border">{children}</main>
    </div>
  );
}
