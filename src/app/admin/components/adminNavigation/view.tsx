import Link from "next/link";

export const AdminNavigation = () => {
  return <aside className="row-span-full col-start-2">
    <ul>
      <li><Link href={"admin/profile"}>پروفایل</Link></li>
    </ul>
  </aside>;
};
