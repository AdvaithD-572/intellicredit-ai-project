import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IntelliCredit AI - Corporate Credit Decisioning",
  description: "AI-Powered Corporate Credit Decisioning Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="flex h-screen overflow-hidden bg-[url('/bg-dark.jpg')] bg-cover bg-center">
        {/* We will add a dark gradient overlay in case bg image is missing */}
        <div className="absolute inset-0 bg-background/90 bg-gradient-to-br from-[#0c0f12] via-[#051310] to-[#040d14] -z-10" />
        
        <Sidebar className="w-64 border-r border-white/10 hidden md:block" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header className="h-16 border-b border-white/10 shrink-0" />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
