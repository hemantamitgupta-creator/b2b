import React from "react";

export interface BadgeProps {
  variant?: "published" | "draft" | "category" | "featured" | "inactive";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "category", className = "", children }: BadgeProps) {
  const variantStyles = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    category: "bg-slate-100 text-slate-700 border-slate-200",
    featured: "bg-teal-50 text-[#006061] border-teal-200 font-semibold",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {variant === "published" && (
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500" />
      )}
      {variant === "draft" && (
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500" />
      )}
      {children}
    </span>
  );
}
