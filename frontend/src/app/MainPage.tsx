import IdentifyWebsite from "@/components/IdentifyWebsite";
import ClickHomeLogo from "@/components/ClickHomeLogo";
import SearchNavbar from "@/components/SearchNavBar";
import MainQuestionBox from "@/components/MainQuestionBox";
import AgencyListNavbar from "@/components/AgencyListNavbar";
import QuestionBox from "@/components/QuestionBox";
import Footer from "@/components/Footer";


const MainPage = () => {
    return (
        <div className="container max-w-full">
            <IdentifyWebsite></IdentifyWebsite>
            <ClickHomeLogo></ClickHomeLogo>
            <SearchNavbar></SearchNavbar>
            <div className="main-content flex">
                <div className="w-3/4">
                    <MainQuestionBox></MainQuestionBox>
                </div>
                <div className="w-1/4">
                    <AgencyListNavbar />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainPage;