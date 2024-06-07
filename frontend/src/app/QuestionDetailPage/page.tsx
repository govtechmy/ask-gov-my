import IdentifyWebsite from "@/components/IdentifyWebsite";
import SearchNavbar from "@/components/SearchNavBar";
import Footer from "@/components/Footer";
import DetailQuestionBox from "@/components/QuestionBox/DetailQuestionBox";


const QuestionDetailPage = () => {
    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <SearchNavbar />
                </div>
            </div>
            <div>Navigation Panel</div>
            <DetailQuestionBox></DetailQuestionBox>
            <div>Recommended Question Box</div>
            <div>Cant find what youre looking for? ask a question button</div>
            <Footer></Footer>
        </div>
    );
};

export default QuestionDetailPage;