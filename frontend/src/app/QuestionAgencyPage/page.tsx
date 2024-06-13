'use client'
import { useSearchParams } from 'next/navigation';
import MainQuestionBox from '@/components/QuestionBox/MainQuestionBox';
import AgencyListNavbar from '@/components/AgencyListNavbar';

const QuestionAgencyPage = () => {
    const searchParams = useSearchParams();
    const agencyName = searchParams.get('name');
    return (
        <div className="container max-w-full">

            <div>
                <div className="main-content flex">
                    <div className="w-3/4">
                        <MainQuestionBox agencyName= {agencyName} />
                    </div>
                    <div className="w-1/4 fixed -right-1">
                        <AgencyListNavbar />
                    </div>
                </div>
            </div>
        </div>
    );

};

export default QuestionAgencyPage;