import { getAgencyList, getDynamicAgencyMap } from '@/actions/questionServices';
import BaseHeader from '@/components/common/Header/BaseHeader';
import SearchNavbar from '@/components/common/SearchNavbar/SearchNavbar';
import ContextSearchBar from '@/components/context/ContextSearchBar';
import { Agency } from '@/types/types';

export default async function AgencyLayout({
  children,
  params: { agencyAcronym },
}: {
  children: React.ReactNode;
  params: {
    agencyAcronym: string;
  };
}) {
  const agencyMap = await getDynamicAgencyMap();
  const agencyUUID = agencyMap[agencyAcronym.toUpperCase()];
  const upperCaseAgencyAcronym = agencyAcronym.toUpperCase();
  let agencyList: any = [];

  try {
    agencyList = await getAgencyList();

    if (!agencyList || agencyList.length === 0) {
      throw new Error('Agency list is empty');
    }
  } catch {}

  const currentAgency = agencyList.find(
    (agency: { acronym: string }) => agency.acronym === upperCaseAgencyAcronym,
  );

  if (!currentAgency) {
    console.log(`Agency with acronym '${agencyAcronym}' not found.`);
  }

  return (
    <>
      <ContextSearchBar>
        <BaseHeader agencyAcronym={agencyAcronym}></BaseHeader>
        <SearchNavbar
          agency={{
            acronym: agencyAcronym,
            uuid: agencyUUID,
            details: currentAgency,
          }}
        ></SearchNavbar>
      </ContextSearchBar>
      {children}
    </>
  );
}
