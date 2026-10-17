"use client";

import React, { useState } from "react";
import {
  Handshake,
  Users,
  Building2,
  Scale,
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function CompanyOverviewSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about-us" className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              WELCOME TO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Kraft Surgicals Private Limited
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-normal">
              <p>
                Incepted in the year <strong className="text-slate-900">"2015"</strong>, We <strong className="text-slate-900">"Kraft Surgicals Private Limited"</strong> is exquisitely instrumental in the realm of Exporter, Supplier, Importer Trader and Manufacturer of <strong className="text-[#006061]">Laparoscopy Instruments</strong>, Endoscopic 4K Imaging Systems, CO2 Insufflators, and specialized Surgical Dissectors.
              </p>
              <p>
                Our precision instruments undergo stringent metallurgical grading using medical-grade surgical alloy (AISI 420 & AISI 316L) to ensure maximum corrosion resistance, sharpness retention through steam autoclaving, and micro-tolerance dimensional accuracy.
              </p>
              {expanded && (
                <div className="space-y-3 pt-2 text-slate-600 border-t border-slate-100 animate-in fade-in duration-200">
                  <p>
                    Backed by advanced CNC Swiss precision machining and strict batch traceability, we serve top medical institutes, laparoscopic research academies, and government hospital supply tenders across India, Southeast Asia, Middle East, and Africa.
                  </p>
                  <p>
                    All electrosurgical devices comply with IEC 60601-1 electrical safety standards and CE mark certification guidelines.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#006061] hover:underline cursor-pointer pt-1"
            >
              <span>{expanded ? "Read Less..." : "Read More..."}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-[#006061]">
                <ShieldCheck className="w-4 h-4" />
                TrustSeal Verified
              </span>
              <span>•</span>
              <span>GSTIN: 27AAGCK0266P1Z3</span>
            </div>
          </div>

          {/* Right Column: 6 Corporate Capability Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Nature of Business */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Nature of Business
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    Manufacturer & Exporter
                  </span>
                </div>
              </div>

              {/* Card 2: Employees */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Total Number of Employees
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    26 to 50 People
                  </span>
                </div>
              </div>

              {/* Card 3: GST Registration Date */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    GST Registration Date
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    01-07-2017
                  </span>
                </div>
              </div>

              {/* Card 4: Legal Status */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Legal Status of Firm
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    Limited Company
                  </span>
                </div>
              </div>

              {/* Card 5: Annual Turnover */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Annual Turnover
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    1.5 - 5 Cr
                  </span>
                </div>
              </div>

              {/* Card 6: Import Export Code (IEC) */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-[#006061] transition-colors">
                <div className="w-10 h-10 rounded-md bg-teal-50 text-[#006061] flex items-center justify-center shrink-0 border border-teal-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Import Export Code (IEC)
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                    0315911565
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
