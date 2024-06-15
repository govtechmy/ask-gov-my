import Link from 'next/link';
import { getQuestionById } from '@/API Services/questionServices';

interface Props {
    params: {
        agencyId: string;
        questionId: string;
    };
}

const QuestionDetailPage = async ({ params }: Props) => {
    const { agencyId, questionId } = params;

    const question = await getQuestionById(agencyId, questionId);

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
                <p>Can&apos;t find what you&apos;re looking for?</p>
                <Link href="/questions/new">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Ask a Question</button>
                </Link>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
