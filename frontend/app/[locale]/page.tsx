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

const MainPage = async () => {
  const { questions } = await getAllQuestions();
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
