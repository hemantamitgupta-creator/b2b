"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { Search, X, Filter } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
}

export function ProductFilters({
  categories,
  currentCategory = "",
  currentSearch = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);

  const applyFilters = (newCat?: string, newSearch?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const catToSet = newCat !== undefined ? newCat : currentCategory;
    const searchToSet = newSearch !== undefined ? newSearch : search;

    if (catToSet) {
      params.set("category", catToSet);
    } else {
      params.delete("category");
    }

    if (searchToSet && searchToSet.trim().length > 0) {
      params.set("search", searchToSet.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(undefined, search);
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/products");
    });
  };

  const hasActiveFilters = Boolean(currentCategory || currentSearch);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instruments by name (e.g. Scissor, Forceps, Clamp)..."
            className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006061] focus:bg-white transition-all text-slate-900"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#006061] text-white hover:bg-[#004d4e] transition-colors cursor-pointer"
          >
            {isPending ? "Filtering..." : "Search"}
          </button>
        </form>

        {/* Category Filter Pills / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#006061]" />
            <span className="hidden sm:inline">Discipline:</span>
          </div>

          <select
            value={currentCategory}
            onChange={(e) => applyFilters(e.target.value, undefined)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006061] cursor-pointer"
          >
            <option value="">All Surgical Disciplines</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
