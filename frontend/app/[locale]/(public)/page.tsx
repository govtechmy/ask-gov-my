import {
  getAgencyList,
  getAllQuestions,
  getTrendingAgencies,
  getDynamicAgencyMap,
} from '@/actions/questionServices';
import QuestionBox from '@/components/common/QuestionBox/QuestionBox';
import Footer from '@/components/common/Footer';
import TrendingAgencies from '@/components/common/TrendingAgencies';
import WordTranslate from '@/components/common/WordTranslate';

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
