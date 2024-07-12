import { getQuestionsByAgency } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import { AGENCY_TO_UUID } from '@/lib/agency';
import Header from '@/components/HeaderDetails/Header';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import TopicList from '@/components/TopicList';
import { getTopicByAgency } from '@/actions/questionServices';

interface Props {
  params: {
    agencyId: string;
    locale: string;
  };
  searchParams: {
    page?: string;
  };
}

const AgencyPage = async ({ params, searchParams }: Props) => {
  const { agencyId, locale } = params; //agencyId is actually agency acronym
  const agencyUUID = AGENCY_TO_UUID[agencyId.toUpperCase()]
  const { questions } = await getQuestionsByAgency(agencyUUID);
  const topics = await getTopicByAgency(parseInt(agencyUUID))

  return (
    <div className="container max-w-full max-h-full">
      <Header />
      <SearchNavbar />
      <div className="mt-4 flex">
        <div className="w-3/4">
          <QuestionBox questions={questions} />
        </div>
        <div className="w-1/4">
          <TopicList topics={topics} locale={locale} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgencyPage;
