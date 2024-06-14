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

    return (
        <div className="container max-w-full">
            <div className="flex mt-4">
                <div className="w-1/4">
                    <AgencySidebar agencies={agencies} />
                </div>
                <div className="w-3/4">
                <QuestionBox questions={questions} totalPages={totalPages} currentPage={page} agencyId={agencyId} />
                </div>
            </div>
        </div>
    );
};

export default AgencyPage;

//this is comment