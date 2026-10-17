import React from "react";
import { getAllCategoriesAdmin } from "@/services/categories";
import { CategoryListManager } from "@/components/admin/CategoryListManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return <CategoryListManager categories={categories} />;
}
