import IdentifyWebsite from '@/components/IdentifyWebsite';
import ClickHomeLogo from '@/components/ClickHomeLogo';
import SearchNavbar from '@/components/SearchNavBar';
import MainQuestionBox from '@/components/QuestionBox/MainQuestionBox';
import AgencyListNavbar from '@/components/AgencyListNavbar';
import Footer from '@/components/Footer';
import AgencyListComp from '@/components/AgencyListComp';

const MainPage = () => {
    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <ClickHomeLogo />
                    <SearchNavbar />
                </div>
            </div>

            <div>
                <div className="main-content flex">
                    <div className="w-3/4">
                        <MainQuestionBox />
                    </div>
                    <div className="w-1/4 fixed -right-1">
                        <AgencyListNavbar></AgencyListNavbar>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MainPage;
