import {
  getQuestionsByAgency,
  getAgencyList,
} from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import AgencySidebar from '@/components/AgencySideBar';
import { AGENCY_TO_UUID } from '@/lib/agency';
import Header from '@/components/HeaderDetails/Header';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';

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
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 10;
  const { questions, total } = await getQuestionsByAgency(
    AGENCY_TO_UUID[agencyId.toUpperCase()],
    page,
    pageSize,
  );
  const totalPages = Math.ceil(total / pageSize);

  const agencies = await getAgencyList();

  const formattedAgencyId = agencyId.replace(/\s+/g, '_').toUpperCase();

  return (
    <div className="container max-w-full max-h-full">
      <Header></Header>
      <SearchNavbar></SearchNavbar>
      <div className="mt-4 flex">
        <div className="w-1/4">
          <AgencySidebar agencies={agencies} />
        </div>
        <div className="w-3/4">
          <QuestionBox
            questions={questions}
            totalPages={totalPages}
            currentPage={page}
            agencyId={formattedAgencyId}
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AgencyPage;
