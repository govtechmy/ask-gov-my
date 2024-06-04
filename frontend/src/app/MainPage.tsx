import IdentifyWebsite from "@/components/IdentifyWebsite";
import ClickHomeLogo from "@/components/ClickHomeLogo";
import SearchNavbar from "@/components/SearchNavBar";
import MainQuestionBox from "@/components/MainQuestionBox";
import AgencyListNavbar from "@/components/AgencyListNavbar";
import Footer from "@/components/Footer";

const MainPage = () => {
    return (
        <div className="container max-w-full">
            <div className="fixed top-0 left-0 w-full bg-white">
                <div className="">
                    <IdentifyWebsite />
                    <ClickHomeLogo />
                    <SearchNavbar />
                </div>
            </div>

            <div className="pt-96">
                <div className="main-content flex">
                    <div className="w-3/4">
                        <MainQuestionBox />
                    </div>
                    <div className="w-1/4">
                        <AgencyListNavbar />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MainPage;
