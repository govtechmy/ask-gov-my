import React from "react";
import BaseHeader from "@/components/common/Header/BaseHeader";
import SearchNavbar from "@/components/common/SearchNavbar/SearchNavbar";
import ContextSearchBar from "@/components/context/ContextSearchBar";
import Footer from "@/components/common/Footer";

export default function DashboardLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      <ContextSearchBar>
        <BaseHeader></BaseHeader>
        <SearchNavbar></SearchNavbar>
      </ContextSearchBar>
      <div className="container p-4.5  lg:py-8 flex-col lg:flex-row flex print:mt-0 print:max-w-none gap-12">
        <div className="flex-1">{children}</div>
        {sidebar}
      </div>
      <Footer />
    </>
  );
}
