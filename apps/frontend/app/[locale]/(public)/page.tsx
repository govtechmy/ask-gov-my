import {
  getAgencyList,
  getAllQuestions,
  getTrendingAgencies,
  getDynamicAgencyMap,
} from "@/actions/questionServices";
import QuestionBox from "@/components/common/QuestionBox/QuestionBox";
import Footer from "@/components/common/Footer";
import TrendingAgencies from "@/components/common/TrendingAgencies";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";

const MainPage: FSP = async ({ searchParams }) => {
  const { page, search, start, end } = searchParams || {
    page: 1,
    search: "",
    start: undefined,
    end: undefined,
  };
  const questions = await getAllQuestions(page);
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

export default inject(MainPage);
