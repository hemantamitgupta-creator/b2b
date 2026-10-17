"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { SpecificationFormData } from "@/lib/validations/product";

interface SpecificationsEditorProps {
  specifications: SpecificationFormData[];
  onChange: (specs: SpecificationFormData[]) => void;
}

export function SpecificationsEditor({
  specifications,
  onChange,
}: SpecificationsEditorProps) {
  const handleAdd = () => {
    onChange([
      ...specifications,
      {
        label: "",
        value: "",
        sort_order: specifications.length,
      },
    ]);
  };

  const handleUpdate = (
    index: number,
    field: "label" | "value",
    val: string
  ) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = specifications.filter((_, i) => i !== index);
    // Re-index sort_order
    const reindexed = updated.map((spec, i) => ({ ...spec, sort_order: i }));
    onChange(reindexed);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === specifications.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...specifications];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((spec, i) => ({ ...spec, sort_order: i }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Technical Specifications
          </h4>
          <p className="text-xs text-slate-500">
            Add dynamic engineering parameters (e.g., Shaft Length, Jaw Type, Material Grade).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-[#006061] hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Parameter</span>
        </button>
      </div>

      {specifications.length === 0 ? (
        <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
          <p className="text-xs text-slate-500">
            No specifications added yet. Click &quot;Add Parameter&quot; to define technical details.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  aria-label="Move spec up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === specifications.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  aria-label="Move spec down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Working Length)"
                  value={spec.label}
                  onChange={(e) => handleUpdate(index, "label", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006061]"
                  required
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 330 mm)"
                  value={spec.value}
                  onChange={(e) => handleUpdate(index, "value", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006061]"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
                aria-label="Remove specification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
