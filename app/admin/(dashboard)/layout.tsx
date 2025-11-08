// app/admin/(dashboard)/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminJWT, getAdminCookieName } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const token = store.get(getAdminCookieName())?.value;

  if (!token) redirect("/admin/login");
  try {
    verifyAdminJWT(token);
  } catch {
    redirect("/admin/login");
  }

  return (
    // ⬇️ Stack on mobile, side-by-side from md up
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
