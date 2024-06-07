import IdentifyWebsite from "@/components/IdentifyWebsite";
import ClickHomeLogo from "@/components/ClickHomeLogo";
import SearchNavbar from "@/components/SearchNavBar";
import MainQuestionBox from "@/components/MainQuestionBox";
import AgencyListNavbar from "@/components/AgencyListNavbar";
import Footer from "@/components/Footer";


const QuestionDetailPage = () => {
    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <SearchNavbar />
                    <div>Navigation Panel</div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default QuestionDetailPage;