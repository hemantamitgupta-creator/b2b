"use client";

import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Share2,
  Send,
} from "lucide-react";

export function QuickEnquirySection() {
  const [requirement, setRequirement] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="contact-us" className="bg-[#1e242d] text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Contact Us Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                Contact Us
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct factory showroom and institutional tender coordination office.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00A99D] shrink-0 mt-1" />
                <div className="space-y-1">
                  <span className="font-bold text-white block text-sm">
                    Rahul Jay (CEO)
                  </span>
                  <span className="font-bold text-teal-300 block">
                    Kraft Surgicals Private Limited
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    Film City, Compd Gokuldham, Gen A K Vaidya Marg<br />
                    Mumbai - 400097, Maharashtra, India
                  </p>
                  <a
                    href="https://maps.google.com/?q=Gokuldham+Gen+A+K+Vaidya+Marg+Mumbai"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#00A99D] hover:underline font-bold pt-1"
                  >
                    <span>Get Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00A99D] shrink-0" />
                <a
                  href="mailto:procurement@kraftsurgicals.in"
                  className="text-slate-300 hover:text-white font-medium"
                >
                  Send Email (procurement@kraftsurgicals.in)
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00A99D] shrink-0" />
                <a
                  href="tel:+917942788235"
                  className="text-white hover:text-[#00A99D] font-bold text-base"
                >
                  07942788235
                </a>
                <span className="text-[11px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800">
                  83% Response Rate
                </span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-slate-400 font-semibold text-xs">Share:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#006061] flex items-center justify-center text-white transition-colors"
                    aria-label="Facebook"
                  >
                    f
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#006061] flex items-center justify-center text-white transition-colors font-bold text-xs"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#006061] flex items-center justify-center text-white transition-colors font-bold text-xs"
                    aria-label="X / Twitter"
                  >
                    𝕏
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Requirement Card */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-teal-50 text-[#006061] flex items-center justify-center mx-auto border-2 border-teal-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Requirement Submitted Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you <strong>{name || "Valued Doctor/Procurement Lead"}</strong>. We have logged your requirement and will connect at <strong>+91 {phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setRequirement("");
                      setPhone("");
                      setName("");
                    }}
                    className="py-2 px-6 bg-[#006061] text-white text-xs font-bold rounded-md hover:bg-[#004d4e] transition-colors"
                  >
                    Submit Another Requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Describe Your Requirement
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Requirement Details *
                    </label>
                    <textarea
                      rows={3}
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      placeholder="I would like to inquire about laparoscopic camera units, trocars, harmonic shears..."
                      className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-700 text-xs font-semibold">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter Your Number"
                          className="w-full p-2.5 rounded-r-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto py-3 px-8 bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
