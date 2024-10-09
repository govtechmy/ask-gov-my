import React from "react";
import { getAgencyList } from "@/actions/questionServices";
import Footer from "@/components/layout/footer";

// All route not in agency list will return 404
export const dynamicParams = false;

// Generate segments for both [agencyAcronym]
export async function generateStaticParams() {
  const agencies = await getAgencyList();
  return agencies.map((agency) => ({
    agencyAcronym: agency.acronym.toLowerCase(),
  }));
}

export default async function AgencyLayout({ children, params }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
