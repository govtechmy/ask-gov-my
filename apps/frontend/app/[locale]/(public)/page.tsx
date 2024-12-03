import { getAllQuestions } from "@/actions/public/question";
import QuestionCard from "@/components/common/QuestionBox/QuestionCard";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";
import { PageResult, Question } from "@/types/types";
import { Paginator } from "@/components/client/paginator";

interface MainPageProps {
  questions: PageResult<Question>;
}

const MainPage: FSP<MainPageProps> = async ({ data, params }) => {
  const { questions } = data!;
  return (
    <div className="w-full flex flex-col gap-6">
      <WordTranslate
        translate="Mainpage"
        keyword="trendingQ"
        className="font-semibold text-base text-black-700"
      />

      <div className="flex flex-col gap-6">
        {questions.results.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            locale={params?.locale}
          />
        ))}
      </div>

      <Paginator route="home" data={questions.page} />
    </div>
  );
};

export default inject(MainPage, {
  // debug: true,
  async data({ searchParams, params }) {
    const { page = 1 } = searchParams;
    const questions = await getAllQuestions({ page }, params);
    return {
      questions: questions.data,
    };
  },
});
