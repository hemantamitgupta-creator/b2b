import React from "react";
import { ProductSpecification } from "@/types";
import { FileText } from "lucide-react";

interface SpecificationsTableProps {
  specifications?: ProductSpecification[];
}

export function SpecificationsTable({ specifications = [] }: SpecificationsTableProps) {
  if (specifications.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500">
          Standard technical specifications are supplied upon request for institutional tender submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-xs bg-white">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Technical Specifications & Engineering Parameters
        </h3>
      </div>
      <dl className="divide-y divide-slate-100">
        {specifications.map((spec, index) => (
          <div
            key={spec.id || index}
            className={`grid grid-cols-1 sm:grid-cols-3 px-5 py-3 text-xs sm:text-sm ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
            }`}
          >
            <dt className="font-semibold text-slate-800 sm:col-span-1">
              {spec.label}
            </dt>
            <dd className="text-slate-600 sm:col-span-2 mt-1 sm:mt-0 font-medium">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
