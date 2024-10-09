import React from "react";
import TopicsSidebar from "../../../@sidebar/page";
import { getAgencyList, getDynamicAgencyMap } from "@/actions/questionServices";
import BaseHeader from "@/components/layout/header/BaseHeader";
import SearchNavbar from "@/components/common/SearchNavbar/SearchNavbar";
import ContextSearchBar from "@/components/context/ContextSearchBar";

export default async function TopicLayout({ children, params }) {
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
      <div className="container p-4.5 lg:px-0 lg:py-8 flex-col-reverse lg:flex-row flex print:mt-0 print:max-w-none gap-4.5 lg:gap-12">
        <div className="flex-1">{children}</div>
        <TopicsSidebar
          params={{
            agencyAcronym: params.agencyAcronym,
            locale: params.locale,
            topicId: params.topicId,
          }}
        />
      </div>
    </>
  );
}
