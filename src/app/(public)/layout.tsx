import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getActiveCategories } from "@/services/categories";
import { FALLBACK_CATEGORIES } from "@/lib/constants/fallbackData";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbCategories = await getActiveCategories();
  const categories = dbCategories.length >= 3 ? dbCategories : FALLBACK_CATEGORIES;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}
