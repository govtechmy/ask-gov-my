import React from "react";
import NavBar from "@/components/layout/header/NavBar";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/layout/footer";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children, sidebar }) {
  return (
    <>
      <SearchBarContextProvider>
        <NavBar />
        <Header />
      </SearchBarContextProvider>
      <div className="container p-4.5  lg:py-8 flex-col lg:flex-row flex print:mt-0 print:max-w-none gap-12">
        <div className="flex-1">{children}</div>
        {sidebar}
      </div>
      <Footer />
    </>
  );
}
