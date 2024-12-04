import React from "react";
import { getAgencyList } from "@/actions/public/agency";
import Footer from "@/components/layout/footer";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";

// All route not in agency list will return 404
export const dynamicParams = false;

// Generate segments for both [agencyAcronym]
export async function generateStaticParams() {
  const { data } = await getAgencyList();
  if (data) {
    return data.map((agency) => ({
      agencyAcronym: agency.acronym.toLowerCase(),
    }));
  }
}

export default async function AgencyLayout({ children, sidebar }) {
  return (
    <SearchBarContextProvider>
      {children}
      <Footer />
    </SearchBarContextProvider>
  );
}
