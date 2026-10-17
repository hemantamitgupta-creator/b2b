"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderTree, PlusCircle, ArrowLeft } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Products Management",
      href: "/admin/products",
      icon: Package,
      exact: false,
    },
    {
      label: "New Product",
      href: "/admin/products/new",
      icon: PlusCircle,
      exact: true,
    },
    {
      label: "Categories Management",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
  ];

  const isCurrent = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href === "/admin/products" && pathname === "/admin/products/new") return false;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0 p-4 md:min-h-[calc(100vh-64px)]">
      <div className="space-y-6">
        <div>
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Catalogue Control
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isCurrent(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? "bg-teal-50 text-[#006061] border border-teal-100"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#006061]" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Catalogue</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
