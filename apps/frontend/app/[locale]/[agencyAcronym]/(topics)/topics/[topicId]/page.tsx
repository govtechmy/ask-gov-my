import React from "react";
import { getAgencyList } from "@/actions/questionServices";
import { getAllQuestions } from "@/actions/public/question";
import { getAllTopics } from "@/actions/public/topic";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";
import { PageResult, Question, Topic } from "@/types/types";
import QuestionCard from "@/components/common/QuestionBox/QuestionCard";
import { Paginator } from "@/components/client/paginator";
import { notFound } from "next/navigation";

interface TopicPageProps {
  questions: PageResult<Question>;
  topics: Topic[];
}

const TopicPage: FSP<TopicPageProps> = async ({ params, data, locale }) => {
  const { questions, topics } = data!;

  const currTopic = topics.find(
    (topic) => topic.id.toString() === params?.topicId
  );
  return (
    <div className="w-full flex flex-col gap-6">
      {params?.topicId === "all" ? (
        <WordTranslate
          translate="Mainpage"
          keyword="trendingQ"
          className="font-semibold text-base text-black-700"
        />
      ) : (
        <div className="flex items-center font-semibold text-base text-black-700">
          <WordTranslate translate={"Topics"} keyword={"showing"} />
          <p>&nbsp;{questions.page.total}&nbsp;</p>
          <WordTranslate
            translate={"Topics"}
            keyword={"questionsin"}
            className="text-nowrap"
          />
          &nbsp;&nbsp;
          <p className="border border-askmygovbrand-200 rounded-md py-1 px-2 text-askmygovtextbrand-600 font-medium hidden lg:block">
            {locale === "ms-MY" ? currTopic?.title_ms : currTopic?.title}
          </p>
        </div>
      )}

      {questions.results.length > 0 ? (
        <>
          <div className="flex flex-col gap-6">
            {questions.results.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                locale={params?.locale}
              />
            ))}
          </div>

          <Paginator route="agencyAllTopics" data={questions.page} />
        </>
      ) : (
        <WordTranslate
          translate="Topics"
          keyword="notfound"
          className="text-base text-dim-500"
        />
      )}
    </div>
  );
};

export default inject(TopicPage, {
  // debug: true,
  async data({ searchParams, params }) {
    const { page = 1 } = searchParams;
    const agencies = await getAgencyList();

    const agencyId = agencies.find(
      (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
    )?.id;

    if (!agencyId) {
      return notFound();
    }

    const topicId = params.topicId === "all" ? undefined : params.topicId;

    const [questions, topics] = await Promise.all([
      getAllQuestions({ page, limit: 6, agencyId, topicId }, params),
      getAllTopics({ agencyId }, params),
    ]);

    return {
      questions: questions.data,
      topics: topics.data,
    };
  },
});
