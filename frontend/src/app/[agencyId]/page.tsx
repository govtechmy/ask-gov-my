import { getQuestionsByAgency, getAgencyList } from '@/API Services/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import AgencySidebar from '@/components/AgencySideBar';

interface Props {
    params: {
        agencyId: string;
    };
    searchParams: {
        page?: string;
    };
}

const AgencyPage = async ({ params, searchParams }: Props) => {
    const { agencyId } = params;
    const page = parseInt(searchParams.page || '1', 10);
    const pageSize = 10;
    const { questions, total } = await getQuestionsByAgency(agencyId, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);

    const agencies = await getAgencyList();

    const AGENCY = {
        "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
        "EDUCATION_MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
        "TRANSPORT_MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
        "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
        "TOURISM_MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
    };

    const formattedAgencyId = agencyId.replace(/\s+/g, '_').toUpperCase();

    return (
        <div className="container max-w-full">
            <div className="flex mt-4">
                <div className="w-1/4">
                    <AgencySidebar agencies={agencies} />
                </div>
                <div className="w-3/4">
                    <QuestionBox questions={questions} totalPages={totalPages} currentPage={page} agencyId={formattedAgencyId} />
                </div>
            </div>
        </div>
    );
};

export default AgencyPage;
