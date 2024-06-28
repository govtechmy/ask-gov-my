import Link from 'next/link';
import { getQuestionById } from '@/actions/questionServices';
import { AGENCY_TO_UUID } from '@/lib/agency';

interface Props {
  params: {
    agencyId: string;
    questionId: string;
  };
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { agencyId, questionId } = params;

  const question = await getQuestionById(
    AGENCY_TO_UUID[agencyId.toUpperCase()],
    questionId,
  );

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="rounded p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">{question.name}</h1>
        <div className="mb-4">
          <strong>Category:</strong>
          <ul className="list-inside list-disc">
            {question.labels.map(label => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: question.description_html }}
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
