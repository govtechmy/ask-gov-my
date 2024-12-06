import React from "react";
import { getAgencyList } from "@/actions/public/agency";
import TopicsSidebar from "../../../@sidebar/page";
import NavBar from "@/components/layout/header/NavBar";
import Header from "@/components/common/Header/Header";
import { notFound } from "next/navigation";

export default async function TopicLayout({ children, params }) {
  const { data: agencies } = await getAgencyList();

  if (!agencies) {
    return notFound();
  }
  const currentAgency = agencies.find(
    (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
  );

  if (!currentAgency) {
    return notFound();
  }

  return (
    <>
      <NavBar agencyAcronym={params.agencyAcronym} />
      <Header agency={currentAgency} />
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
