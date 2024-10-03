import React from "react";
import { getAgencyList, getDynamicAgencyMap } from "@/actions/questionServices";
import BaseHeader from "@/components/common/Header/BaseHeader";
import SearchNavbar from "@/components/common/SearchNavbar/SearchNavbar";
import ContextSearchBar from "@/components/context/ContextSearchBar";

export default async function AgencyLayout({ children, params }) {
  const agencyMap = await getDynamicAgencyMap();
  const agencyUUID = agencyMap[params.agencyAcronym.toUpperCase()];
  const upperCaseAgencyAcronym = params.agencyAcronym.toUpperCase();
  let agencyList: any = [];

  try {
    agencyList = await getAgencyList();

    if (!agencyList || agencyList.length === 0) {
      throw new Error("Agency list is empty");
    }
  } catch {}

  const currentAgency = agencyList.find(
    (agency: { acronym: string }) => agency.acronym === upperCaseAgencyAcronym
  );

  if (!currentAgency) {
    console.log(`Agency with acronym '${params.agencyAcronym}' not found.`);
  }

  return (
    <>
      <ContextSearchBar>
        <BaseHeader agencyAcronym={params.agencyAcronym}></BaseHeader>
        <SearchNavbar
          agency={{
            acronym: params.agencyAcronym,
            uuid: agencyUUID,
            details: currentAgency,
          }}
        ></SearchNavbar>
      </ContextSearchBar>
      {children}
    </>
  );
}
