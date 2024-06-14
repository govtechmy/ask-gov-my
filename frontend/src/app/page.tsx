<<<<<<< HEAD
import { getAllQuestions } from '@/API Services/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import AgencySidebar from '@/components/AgencySideBar';
import { getAgencyList } from '@/API Services/questionServices';

const MainPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
    const page = parseInt(searchParams.page || '1', 10);
    const pageSize = 10;
    const { questions, total } = await getAllQuestions(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    const agencies = await getAgencyList();
=======
import MainQuestionBox from '@/components/QuestionBox/MainQuestionBox';
import AgencyListNavbar from '@/components/AgencyListNavbar';
>>>>>>> FooterNHeader

    return (
        <div className="container max-w-full">
            <div className="flex mt-4">
                <div className="w-1/4">
                    <AgencySidebar agencies={agencies} />
                </div>
                <div className="w-3/4">
                    <QuestionBox questions={questions} totalPages={totalPages} currentPage={page} />
=======
            <div>
                <div className="main-content flex">
                    <div className="w-3/4">
                        <MainQuestionBox />
                    </div>
                    <div className="w-1/4 fixed -right-1">
                        <AgencyListNavbar />
                    </div>
>>>>>>> FooterNHeader
                </div>
            </div>
        </div>
    );
};

export default MainPage;