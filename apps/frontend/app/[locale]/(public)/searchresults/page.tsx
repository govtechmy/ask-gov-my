import {
  getTrendingAgencies,
  getDynamicAgencyMap,
  getAgencyList,
} from "@/actions/questionServices";
import { searchQuestionsWithPagination } from "@/actions/searchServices";
import QuestionBox from "@/components/common/QuestionBox/QuestionBox";
import Footer from "@/components/common/Footer";
import TrendingAgencies from "@/components/common/TrendingAgencies";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";

const SearchResultPage: FSP = async ({ searchParams }) => {
  const { page, query, start, end } = searchParams || {
    page: 1,
    query: "",
    start: undefined,
    end: undefined,
  };
  const questions = await searchQuestionsWithPagination(query, page);
  const trendingAgencies = await getTrendingAgencies();
  const agencyMap = await getDynamicAgencyMap();
  const agencyList = await getAgencyList();

  return (
    <div>
      <div className="container mt-10 flex">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-7 flex">
            {questions.totalItems}&nbsp;
            <div>
              <WordTranslate translate={"Search"} keyword={"search_result"} />
            </div>
            <div>&nbsp;"{query}"</div>
          </div>
          {questions.data.length > 0 ? (
            <QuestionBox
              questions={questions}
              agencyMap={agencyMap}
              agencyList={agencyList}
            />
          ) : (
            <div className="h-[220px] w-[900px] text-dim-500">
              <WordTranslate
                translate={"Search"}
                keyword={"answernotfound"}
              ></WordTranslate>
            </div>
          )}
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700">
            <WordTranslate translate={"Mainpage"} keyword={"trendingA"} />
          </div>
          <TrendingAgencies trendingAgencies={trendingAgencies} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default inject(SearchResultPage);
