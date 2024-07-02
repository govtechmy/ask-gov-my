import { getAllQuestions } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import AgencySidebar from '@/components/AgencySideBar';
import { getAgencyList } from '@/actions/questionServices';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';

const MainPage = async ({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) => {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 1000;
  const { questions, total } = await getAllQuestions(page, pageSize);
  const totalPages = Math.ceil(total / pageSize);
  const agencies = await getAgencyList();

  return (
    <div className="container max-w-full">
      <Header locale={locale} />
      <SearchNavbar />
      <div className="mt-4 flex">
        <div className="w-1/4">
          <AgencySidebar agencies={agencies} />
        </div>
        <div className="w-3/4 pr-6">
          <div className="px-4 py-5 font-semibold">
            Top Questions From Citizens
          </div>
          <QuestionBox questions={questions} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
