import Link from "next/link";
import { getQuestionById, getTopicsDetail } from "@/actions/questionServices";

interface Props {
  params: {
    agencyId: string;
    questionId: string;
  };
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { agencyId, questionId } = params;

  const question = await getQuestionById(questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  const topicTitles = await getTopicsDetail(question.topics);

  return (
    <div className="container mx-auto">
      <div className="rounded p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">{question.question}</h1>
        <div className="mb-4">
          <strong>Category:</strong>
          <ul className="list-inside list-disc">
            {topicTitles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: question.answer }}
        />
      </div>
      <div className="mt-6">
        <h2 className="mb-2 text-xl font-bold">Recommended Questions</h2>
        <div>Recommended Question Box</div>
      </div>
      <div className="mt-6">
        <p>Can&apos;t find what you&apos;re looking for?</p>
        <Link href={`/questions/new`}>
          <button className="ml-2 rounded bg-blue-500 px-4 py-2 text-white">
            Ask a Question
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
