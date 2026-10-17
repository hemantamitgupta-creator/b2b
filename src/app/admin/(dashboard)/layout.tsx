import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAuth } from "@/lib/auth/session";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentAuth();

  // If user is not authenticated or not an administrator, redirect to admin login
  if (!auth.user || !auth.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <AdminHeader userEmail={auth.user.email} />
      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
