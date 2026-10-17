"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Building,
  Mail,
  Send,
} from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  initialPrice?: string;
}

export function QuoteModal({
  isOpen,
  onClose,
  productName,
  initialPrice,
}: QuoteModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [requirement, setRequirement] = useState(
    `I am interested in ${productName}. Please share institutional bulk quotation and delivery timeline.`
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Request Quotation · Kraft Surgicals"
      description={`Direct Institutional Pricing for: ${productName}`}
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-[#006061] flex items-center justify-center mx-auto border-2 border-teal-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Quotation Request Received!
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Thank you, <strong>{name || "Valued Customer"}</strong>. Our procurement desk will contact you at <strong>+91 {phone}</strong> within 15 minutes.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1 text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Product:</span>
              <span className="font-semibold text-slate-800">{productName}</span>
            </div>
            {initialPrice && (
              <div className="flex justify-between">
                <span className="text-slate-400">Indicative Price:</span>
                <span className="font-semibold text-[#006061]">{initialPrice}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Quantity:</span>
              <span className="font-semibold text-slate-800">{quantity} Piece(s)</span>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleReset}
            className="bg-[#006061] hover:bg-[#004d4e] px-8 text-xs font-bold"
          >
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Header Info Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#006061] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block text-xs">
                Direct Manufacturer Procurement
              </span>
              <span className="text-slate-600 text-[11px]">
                GST: 27AAGCK0266P1Z3 · CE & ISO 13485:2016 Certified
              </span>
            </div>
          </div>

          {/* Requirement Text */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Requirement Details
            </label>
            <textarea
              rows={3}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="w-full p-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
              required
            />
          </div>

          {/* Quantity & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estimated Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number (for WhatsApp/Call) *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-2.5 rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-semibold">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-r-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Name & Hospital/Company */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Your Name / Hospital / Organization
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Sharma / Apollo Hospitals"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006061] text-xs text-slate-800"
            />
          </div>

          {/* Contact Helpline reminder */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-[#006061]" />
              Direct Helpline: 07942788235 (83% Response rate)
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#006061] hover:bg-[#004d4e] font-bold text-xs px-6"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit Requirement
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
