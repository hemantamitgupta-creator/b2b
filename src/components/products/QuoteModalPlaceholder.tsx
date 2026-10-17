"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PhoneCall, ShieldCheck, Mail, Building, FileCheck, CheckCircle2 } from "lucide-react";

interface QuoteModalPlaceholderProps {
  productName: string;
}

export function QuoteModalPlaceholder({ productName }: QuoteModalPlaceholderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto font-bold tracking-wide shadow-md cursor-pointer bg-[#006061] hover:bg-[#004d4e]"
      >
        <PhoneCall className="w-4 h-4 mr-2" />
        Get Best Quote
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Request Institutional Quotation"
        description={`Direct Wholesale Pricing for: ${productName}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-950 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#006061] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm mb-1 text-slate-900">
                  Kraft Surgicals B2B Procurement Desk
                </span>
                <p className="text-slate-600">
                  Direct procurement from manufacturer. Contact our quotation team for custom batch quantities, OEM laser engraving, and CE certification documentation.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#006061]" />
              <span>Direct Quotation Desk Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Procurement Email
                </span>
                <a
                  href={`mailto:procurement@kraftsurgicals.in?subject=Quote%20Request:%20${encodeURIComponent(productName)}`}
                  className="font-bold text-[#006061] hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  procurement@kraftsurgicals.in
                </a>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Hotline (83% Response Rate)
                </span>
                <a
                  href="tel:+917942788235"
                  className="font-bold text-[#006061] hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  +91-7942788235
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006061]" />
              <span>GSTIN: 27AAGCK0266P1Z3 · Trustseal Verified Supplier</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006061]" />
              <span>Full metallurgical test reports and ISO 13485:2016 conformity</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
              Tender specifications & CE certificates available
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
