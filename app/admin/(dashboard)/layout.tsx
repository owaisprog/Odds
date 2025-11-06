import AdminSidebar from "@/components/admin/AdminSidebar";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ⬇️ stack on mobile, row from md+
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
