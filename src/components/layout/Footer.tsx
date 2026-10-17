"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Category } from "@/types";

interface FooterProps {
  categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
  return (
    <footer className="bg-[#f9fafb] text-slate-700 text-xs border-t border-slate-200">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-tight border-b border-slate-200 pb-2">
              Company
            </h4>
            <ul className="space-y-2 text-slate-600 text-xs">
              <li>
                <a href="#about-us" className="hover:text-[#006061] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#006061] transition-colors">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <a href="#about-us" className="hover:text-[#006061] transition-colors">
                  Corporate Profile & Governance
                </a>
              </li>
              <li>
                <a href="#contact-us" className="hover:text-[#006061] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-[#006061] transition-colors font-medium pt-1"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Admin Catalogue Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Our Products */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-tight border-b border-slate-200 pb-2">
              Our Products
            </h4>
            <ul className="space-y-2 text-slate-600 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:text-[#006061] transition-colors block line-clamp-1"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="text-[#006061] hover:underline font-bold inline-flex items-center gap-1 pt-1"
                >
                  <span>View All Categories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quality Standards & Manufacturing */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-tight border-b border-slate-200 pb-2">
              Institutional Assurance
            </h4>
            <p className="text-slate-500 leading-relaxed text-xs">
              Precision surgical & laparoscopic instruments engineered for hospital networks, surgical dealers, and global institutional tenders.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <span>ISO 13485:2016 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <span>CE Compliant Medical Devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <span>GST: 27AAGCK0266P1Z3</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <span>IndiaMART TrustSeal Verified</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-tight border-b border-slate-200 pb-2">
              Share & Connect
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <a href="tel:+917942788235" className="font-bold text-slate-900 hover:text-[#006061]">
                  Call: +91-7942788235
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#006061] shrink-0" />
                <a href="mailto:procurement@kraftsurgicals.in" className="hover:text-[#006061]">
                  procurement@kraftsurgicals.in
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#006061] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Film City, Compd Gokuldham, Gen A K Vaidya Marg, Mumbai - 400097
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Share Us:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[10px] cursor-pointer">
                  f
                </span>
                <span className="w-6 h-6 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[10px] cursor-pointer">
                  in
                </span>
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer">
                  𝕏
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-200 bg-slate-100 py-4 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p>
              ©<strong>Kraft Surgicals Private Limited</strong>. All Rights Reserved (Terms of Use).
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Developed and Managed by IndiaMART InterMESH Limited
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-[#006061] font-bold text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006061]" />
              <span>IndiaMART Verified Member</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
