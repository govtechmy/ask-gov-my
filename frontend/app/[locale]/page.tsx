import {
  getAgencyList,
  getAllQuestions,
  getTrendingAgencies,
  getDynamicAgencyMap,
} from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';
import ContextSearchBar from '@/components/ContextSearchBar';

const MainPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 1000;
  const { questions } = await getAllQuestions(page, pageSize);
  const trendingAgencies = await getTrendingAgencies();
  const agencyList = await getAgencyList();
  const agencyMap = await getDynamicAgencyMap();

  return (
    <div>
      <IdentifyWebsite />
      <ContextSearchBar>
        <Header />
        <SearchNavbar />
      </ContextSearchBar>

      <div className="container mt-10 flex">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-7">
            <WordTranslate translate="Mainpage" keyword="trendingQ" />
          </div>
          <QuestionBox
            questions={questions}
            agencyMap={agencyMap}
            agencyList={agencyList}
          />
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700">
            <WordTranslate translate="Mainpage" keyword="trendingA" />
          </div>
          <TrendingAgencies trendingAgencies={trendingAgencies} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;

// color for focus shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE] dark:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE]
