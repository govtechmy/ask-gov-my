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
    "ef40d294-8737-4f3a-a97b-c1ed4ce2f174": "MINISTRY_OF_EDUCATION",
    "d13c5167-f77d-43d6-8efc-35f2985316a3": "MINISTRY_OF_TRANSPORTATION",
    "ac051d6a-39b6-4df2-b6a6-12d64b48c780": "MINISTRY_OF_HEALTH",
    "108f76f0-7b0a-4b4f-828e-7c840156a3f9": "MINISTRY_OF_ECONOMY",
    "214d9194-ff01-46fc-9436-97586581f057": "MINISTRY_OF_TOURISM_ARTS_AND_CULTURE",
    "2dc0554f-7951-46ee-9fe4-57541f133038": "MINISTRY_OF_WOMEN_FAMILY_AND_COMMUNITY_DEVELOPMENT",
    "9ac53fde-ce7c-4d86-ab69-7f53a9a91b56": "MINISTRY_OF_NATURAL_RESOURCES_AND_ENVIRONMENTAL_SUSTAINABILITY",
    "f68f639d-56df-4e7a-a0af-8062b66198b8": "MINISTRY_OF_YOUTH_AND_SPORTS",
    "4576929f-1438-4ae9-970b-30f087b8365e": "MINISTRY_OF_HIGHER_EDUCATION",
    "64236d33-b92b-4383-ac97-a4451a981cbe": "MINISTRY_OF_PLANTATION_AND_COMMODITIES",
    "371218a4-f4f2-4e8e-88ac-128ccc03e4c1": "MINISTRY_OF_HOUSING_AND_LOCAL_GOVERNMENT",
    "183a3cab-0d49-468f-8915-aadbe2ecab20": "MINISTRY_OF_HUMAN_RESOURCES",
    "74137394-b689-4fd7-88a9-e3b2f7558758": "MINISTRY_OF_INVESTMENT_TRADE_AND_INDUSTRY"
  }
  

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
