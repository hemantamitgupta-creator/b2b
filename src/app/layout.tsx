import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kraft Surgicals | B2B Precision Surgical Instruments Catalogue",
    template: "%s | Kraft Surgicals",
  },
  description:
    "Leading manufacturer and wholesale supplier of precision-engineered surgical instruments for laparoscopy, orthopedics, cardiology, and general surgery. Institutional quotations for hospitals and dealers.",
  keywords: [
    "surgical instruments",
    "laparoscopic instruments",
    "orthopedic instruments",
    "B2B medical equipment",
    "hospital surgical supplies",
    "surgical scissors",
    "surgical forceps",
    "Kraft Surgicals",
  ],
  authors: [{ name: "Kraft Surgicals Institutional Team" }],
  openGraph: {
    title: "Kraft Surgicals | B2B Surgical Instruments Catalogue",
    description:
      "Precision-engineered surgical instruments with technical specifications for hospital tenders and healthcare networks.",
    siteName: "Kraft Surgicals",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
