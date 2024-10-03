import React from "react";
import { searchQuestionsWithPagination } from "@/actions/searchServices";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";
import { PageResult, Question } from "@/types/types";
import QuestionCard from "@/components/common/QuestionBox/QuestionCard";
import { Paginator } from "@/components/client/paginator";

interface SearchResultPageProps {
  questions: PageResult<Question>;
}

const SearchResultPage: FSP<SearchResultPageProps> = async ({
  searchParams,
  data,
  params,
}) => {
  const query = searchParams?.query;
  const { questions } = data!;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center font-semibold text-base text-black-700">
        <p>{questions.page.total}&nbsp;</p>
        <WordTranslate translate={"Search"} keyword={"search_result"} />
        <p>&nbsp;"{query}"</p>
      </div>

      {questions.results.length > 0 ? (
        <>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-6">
              {questions.results.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  locale={params?.locale}
                />
              ))}
            </div>
          </div>
          <Paginator route="searchresults" data={questions.page} />
        </>
      ) : (
        <div className="text-dim-500">
          <WordTranslate
            translate={"Search"}
            keyword={"answernotfound"}
          ></WordTranslate>
        </div>
      )}
    </div>
  );
};

export default inject(SearchResultPage, {
  // debug: true,
  async data({ searchParams }) {
    const { page = 1, query = "" } = searchParams;
    const questions = await searchQuestionsWithPagination(query, page);
    return {
      questions,
    };
  },
});
