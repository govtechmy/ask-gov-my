import Link from 'next/link';
import { getQuestionById } from '@/API Services/questionServices';

interface Props {
    params: {
        agencyId: string;
        questionId: string;
    };
}

interface AgencyIdToNameMap {
    [key: string]: string;
}

const AGENCY_ID_TO_NAME: AgencyIdToNameMap = {
    "a30895aa-0f27-46b1-b782-9a4ff919cf2d": "MINISTRY_OF_FINANCE",
    "ef40d294-8737-4f3a-a97b-c1ed4ce2f174": "EDUCATION_MINISTRY",
    "d13c5167-f77d-43d6-8efc-35f2985316a3": "TRANSPORT_MINISTRY",
    "ac051d6a-39b6-4df2-b6a6-12d64b48c780": "MINISTRY_OF_HEALTH",
    "a43e382b-6445-43d2-bf03-eeeb74feb0c8": "TOURISM_MINISTRY",
};

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
    const { agencyId, questionId } = params;

    const formattedAgencyId = agencyId.toUpperCase().replace(/%20/g, '_');
    if (!AGENCY_ID_TO_NAME.hasOwnProperty(agencyId)) {
        console.error(`Agency ID not found: ${agencyId}`);
        return <div>Agency ID not found</div>;
    }

    const agencyName = AGENCY_ID_TO_NAME[agencyId];

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
                <Link href={`/questions/new`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Ask a Question</button>
                </Link>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
