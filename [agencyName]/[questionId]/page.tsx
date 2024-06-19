'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getQuestionById } from '@/API Services/questionServices';

interface Props {
  params: {
    agencyName: string;
    questionId: string;
  };
}

const AGENCY: Record<string, string> = {
  "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
  "EDUCATION_MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
  "TRANSPORT_MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
  "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
  "TOURISM_MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
};

const QuestionDetailPage = ({ params }: Props) => {
  const router = useRouter();
  const { agencyName, questionId } = params;
  const formattedAgencyName = agencyName.toUpperCase().replace(/\s+/g, '_');
  const agencyId = AGENCY[formattedAgencyName];
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const question = await getQuestionById(agencyId, questionId);
        setQuestion(question);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    if (agencyId && questionId) {
      fetchData();
    }
  }, [agencyId, questionId]);

  if (!agencyId) {
    return <div>Agency not found</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{question.name}</h1>
        <div className="mb-4">
          <strong>Category:</strong>
          <ul className="list-disc list-inside">
            {question.labels.map(label => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: question.description_html }} />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Recommended Questions</h2>
        <div>Recommended Question Box</div>
      </div>
      <div className="mt-6">
        <p>Can't find what you're looking for?</p>
        <Link href="/questions/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Ask a Question</button>
        </Link>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
