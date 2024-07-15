import {
  getQuestionsByAgency,
  getTopicByAgency,
} from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import { AGENCY_TO_UUID } from '@/lib/agency';
import TopicList from '@/components/TopicList';
import Head from 'next/head';
import SearchNavbarAgency from '@/components/HeaderDetails/SearchNavBarAgency';
import TopicDropdown from '@/components/TopicDropdown';
interface Props {
  params: {
    agencyId: string;
    topicId: string;
    locale: string;
  };
}

const TopicPage = async ({ params }: Props) => {
  const { agencyId, topicId, locale } = params;
  const agencyUUID = AGENCY_TO_UUID[agencyId.toUpperCase()];

  const { questions } = await getQuestionsByAgency(agencyUUID);
  const filteredQuestions = questions.filter(question =>
    question.topics.includes(parseInt(topicId, 10)),
  );

  const topics = await getTopicByAgency(parseInt(agencyUUID, 10));
  const selectedTopic = topics.find(
    topic => topic.id === parseInt(topicId, 10),
  );

  return (
    <div className="">
      <div className="">
        <IdentifyWebsite></IdentifyWebsite>
        <Header></Header>
        <div className="bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636]">
          <div className="container">
            <SearchNavbarAgency
              agencyAcronym={agencyId}
              agencyUUID={agencyUUID}
            />
          </div>
        </div>
        <div className="container mt-10 flex text-out">
          <div className="max-w-screen-2xl">
            <div className="font-semibold text-base text-black-700 pb-7 flex">
              <div>
                {filteredQuestions.length}{' '}
                {locale === 'ms' ? 'soalan topik' : 'questions in'} &nbsp;
              </div>
              <div>
                {locale === 'ms'
                  ? selectedTopic?.title_ms
                  : selectedTopic?.title}
              </div>
            </div>
            <QuestionBox questions={filteredQuestions} />
          </div>

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700">
              <TopicList
                topics={topics}
                locale={locale}
                selectedTopicId={parseInt(topicId)}
                agencyId={agencyId}
              />
              <TopicDropdown
                topics={topics}
                locale={locale}
                selectedTopicId={parseInt(topicId)}
                agencyId={agencyId}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-t">
          <div className="container justify-center mx-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
