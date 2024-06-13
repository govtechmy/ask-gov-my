import { getAllQuestions } from '@/API Services/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import IdentifyWebsite from '@/components/IdentifyWebsite';
import ClickHomeLogo from '@/components/ClickHomeLogo';
import SearchNavbar from '@/components/SearchNavBar';
import AgencySidebar from '@/components/AgencySideBar';
import Footer from '@/components/Footer';
import { getAgencyList } from '@/API Services/questionServices';

const MainPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
    const page = parseInt(searchParams.page || '1', 10);
    const pageSize = 10;
    const { questions, total } = await getAllQuestions(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    const agencies = await getAgencyList();

    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <ClickHomeLogo />
                    <SearchNavbar />
                </div>
            </div>

            <div className="flex mt-4">
                <div className="w-1/4">
                    <AgencySidebar agencies={agencies} />
                </div>
                <div className="w-3/4">
                    <QuestionBox questions={questions} totalPages={totalPages} currentPage={page} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;