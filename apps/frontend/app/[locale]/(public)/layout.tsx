import React from "react";
import Footer from "@/components/layout/footer";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SearchBarContextProvider>
        {children}
        <Footer />
      </SearchBarContextProvider>

      <Script
        defer
        src="https://unpkg.com/@tinybirdco/flock.js"
        data-token={process.env.NEXT_PUBLIC_ANALYTICS_TRACKER_TOKEN}
      />
    </>
  );
}
