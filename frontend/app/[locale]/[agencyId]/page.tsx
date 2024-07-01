import {
  getQuestionsByAgency,
  getAgencyList,
} from "@/actions/questionServices";
import QuestionBox from "@/components/QuestionBox/QuestionBox";
import AgencySidebar from "@/components/AgencySideBar";
import { AGENCY_TO_UUID } from "@/lib/agency";

interface Props {
  params: {
    agencyId: string;
  };
  searchParams: {
    page?: string;
  };
}

const AgencyPage = async ({ params, searchParams }: Props) => {
  const { agencyId } = params;
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 1000;
  const { questions, total } = await getQuestionsByAgency(
    AGENCY_TO_UUID[agencyId.toUpperCase()],
    page,
    pageSize,
  );
  const totalPages = Math.ceil(total / pageSize);

  const agencies = await getAgencyList();

  const formattedAgencyId = agencyId.replace(/\s+/g, "_").toUpperCase();

  return (
    <div className="container max-w-full">
      <div className="mt-4 flex">
        <div className="w-1/4">
          <AgencySidebar agencies={agencies} />
        </div>
        <div className="w-3/4">
          <QuestionBox questions={questions} />
        </div>
      </div>
    </div>
  );
};

export default AgencyPage;
