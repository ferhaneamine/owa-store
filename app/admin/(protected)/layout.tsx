import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar adminName={session.name} adminEmail={session.email} />
      <div className="flex-1 bg-ink px-6 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
