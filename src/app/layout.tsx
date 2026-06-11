import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://signoff.click"),
  title: {
    default: "SignOff — Instant Proof of Delivery",
    template: "%s | SignOff",
  },
  description: "High-performance, mobile-first B2B Proof-of-Delivery Platform. Capture signatures and photos instantly.",
  openGraph: {
    title: "SignOff — Instant Proof of Delivery",
    description: "Capture signatures, verify deliveries with photos, and store tamper-proof records. The high-performance Proof-of-Delivery SaaS for modern logistics teams.",
    url: "https://signoff.click",
    siteName: "SignOff",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SignOff — Instant Proof of Delivery",
    description: "The mobile-first Proof-of-Delivery SaaS for logistics teams. Capture signatures, snap delivery photos, and store tamper-proof records.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
