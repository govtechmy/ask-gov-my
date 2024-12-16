import { getAgencyList } from "@/actions/public/agency";

// All route not in agency list will return 404
export const dynamicParams = false;

// Generate segments for both [agencyAcronym]
export async function generateStaticParams() {
  const { data } = await getAgencyList();
  if (data) {
    return data.map((agency) => ({
      agencyAcronym: agency.acronym.toLowerCase(),
    }));
  } else {
    return [];
  }
}

export default async function AgencyLayout({ children, sidebar }) {
  return children;
}
