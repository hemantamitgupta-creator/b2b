"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Search,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Category } from "@/types";
import { QuoteModal } from "@/components/products/QuoteModal";

interface NavbarProps {
  categories?: Category[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [generalQuoteOpen, setGeneralQuoteOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="w-full bg-white font-sans">
        {/* 1. Top White Header Bar */}
        <div className="border-b border-slate-200 py-3 sm:py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Logo, Title, GST, Location, Payment Protected */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/" className="shrink-0 flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#006061] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    KS
                  </div>
                </Link>

                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight hover:text-[#006061] transition-colors"
                    >
                      Kraft Surgicals Private Limited
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 mt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#006061]" />
                      Mumbai, Maharashtra
                    </span>

                    <span className="text-slate-300 hidden sm:inline">•</span>

                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006061]" />
                      <span>GST No.-</span>
                      <strong className="text-slate-900 font-bold">27AAGCK0266P1Z3</strong>
                    </span>

                    <span className="text-slate-300 hidden md:inline">•</span>

                    <span className="hidden md:flex items-center gap-1 text-[#00A99D] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A99D]" />
                      <span>Payment Protected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: TrustSeal, Phone card, Send Email button */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {/* TrustSeal Badge */}
                <div className="relative w-18 h-12 shrink-0">
                  <Image
                    src="/images/badge-trustseal.svg"
                    alt="IndiaMART TrustSeal Verified"
                    width={72}
                    height={48}
                    className="object-contain"
                  />
                </div>

                {/* Call Helpline Box */}
                <a
                  href="tel:+917942788235"
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-md border border-slate-300 bg-white hover:border-[#006061] transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-[#006061] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#006061] transition-colors leading-tight">
                      Call 07942788235
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium leading-tight">
                      83% Response rate
                    </div>
                  </div>
                </a>

                {/* Send Email CTA */}
                <button
                  type="button"
                  onClick={() => setGeneralQuoteOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs tracking-wide shadow-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-100"
                  aria-label="Toggle navigation"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar (Dark Charcoal #2f333a) */}
        <nav
          className={`w-full bg-[#2f333a] text-white transition-all z-40 ${
            isScrolled ? "fixed top-0 left-0 right-0 shadow-md animate-in slide-in-from-top-1" : "relative"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-13">
              {/* Left: Navigation links */}
              <div className="flex items-center gap-1 sm:gap-4">
                {/* Our Products Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setProductsDropdownOpen(true)}
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold tracking-wide uppercase hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Menu className="w-4 h-4 text-white" />
                    <span>Our Products</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {productsDropdownOpen && (
                    <div className="absolute left-0 top-full w-72 sm:w-80 bg-white text-slate-800 border border-slate-200 rounded-b-lg shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Surgical Product Categories
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#006061] transition-colors border-b border-slate-50 last:border-b-0"
                            onClick={() => setProductsDropdownOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 p-2 bg-slate-50">
                        <Link
                          href="/products"
                          className="block text-center text-xs font-bold text-[#006061] hover:underline"
                          onClick={() => setProductsDropdownOpen(false)}
                        >
                          View All Instruments Catalogue →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Nav Links */}
                <div className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      pathname === "/" ? "text-[#5EEAD4] font-bold" : "text-white hover:text-teal-200"
                    }`}
                  >
                    Home
                  </Link>

                  <Link
                    href="/products"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      pathname === "/products" ? "text-[#5EEAD4] font-bold" : "text-white hover:text-teal-200"
                    }`}
                  >
                    All Instruments
                  </Link>

                  <a
                    href="#about-us"
                    className="px-3 py-2 text-white hover:text-teal-200 transition-colors"
                  >
                    About Us
                  </a>

                  <a
                    href="#contact-us"
                    className="px-3 py-2 text-white hover:text-teal-200 transition-colors"
                  >
                    Contact Us
                  </a>

                  <Link
                    href="/admin/login"
                    className="px-3 py-2 text-slate-300 hover:text-white flex items-center gap-1 text-xs"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Admin</span>
                  </Link>
                </div>
              </div>

              {/* Right: Attached Search Bar matching Kraft Surgicals */}
              <div className="flex items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products/Services"
                    className="w-36 sm:w-56 md:w-64 h-9 px-3 text-xs text-slate-900 bg-white rounded-l-md border border-r-0 border-slate-300 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3.5 bg-[#006061] hover:bg-[#004d4e] text-white text-xs font-bold rounded-r-md flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </form>

                {/* If scrolled, show compact contact buttons on the right */}
                {isScrolled && (
                  <div className="hidden xl:flex items-center gap-2">
                    <a
                      href="tel:+917942788235"
                      className="px-3 py-1.5 rounded bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      Call 07942788235
                    </a>
                    <button
                      onClick={() => setGeneralQuoteOpen(true)}
                      className="px-3 py-1.5 rounded bg-[#006061] text-white text-xs font-bold hover:bg-[#004d4e] transition-colors"
                    >
                      Send Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-4 space-y-3 animate-in fade-in duration-150">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-white py-1"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-white py-1"
            >
              All Instruments Catalogue
            </Link>
            <div className="border-t border-slate-800 pt-2 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Categories
              </span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-300 hover:text-teal-300 py-1"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
              <a
                href="tel:+917942788235"
                className="py-2.5 px-4 rounded bg-white text-slate-900 font-bold text-xs text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#006061]" />
                <span>Call 07942788235</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGeneralQuoteOpen(true);
                }}
                className="py-2.5 px-4 rounded bg-[#006061] text-white font-bold text-xs text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* General Email/Inquiry Modal */}
      {generalQuoteOpen && (
        <QuoteModal
          isOpen={generalQuoteOpen}
          onClose={() => setGeneralQuoteOpen(false)}
          productName="Surgical Catalogue & Hospital Tender Inquiry"
        />
      )}
    </>
  );
}
