'use client'
import IdentifyWebsite from '@/components/IdentifyWebsite';
import { useSearchParams } from 'next/navigation';
import ClickHomeLogo from '@/components/ClickHomeLogo';
import SearchNavbarAgency from '@/components/SearchNavBarAgency';
import MainQuestionBox from '@/components/QuestionBox/MainQuestionBox';
import AgencyListNavbar from '@/components/AgencyListNavbar';
import Footer from '@/components/Footer';
import MainQuestionBoxAgency from '@/components/QuestionBox/MainQuestionBoxAgency';


const QuestionAgencyPage = () => {
    const searchParams = useSearchParams();
    const agencyName = searchParams.get('name');
    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <div>
                    <IdentifyWebsite />
                    <ClickHomeLogo />
                    <SearchNavbarAgency />
                </div>
            </div>

            <div>
                <div className="main-content flex">
                    <div className="w-3/4">
                        <MainQuestionBoxAgency agencyName= {agencyName} />
                    </div>
                    <div className="w-1/4 fixed -right-1">
                        <AgencyListNavbar />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );

};

export default QuestionAgencyPage;