import React from "react";
import GlobalNav from "@/components/organisms/GlobalNav";
import Footer from "@/components/organisms/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f]">
      {/* 1. Single Unified Primary Navigation Header */}
      <GlobalNav />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* 3. Global Footer (Parchment #f5f5f7) */}
      <Footer />
    </div>
  );
}
