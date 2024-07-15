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
        <div className="bg-white">
          <div className="container flex justify-center mx-auto bg-black-700">
            <Header />
          </div>
        </div>

        <SearchNavbar />

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
                selectedTopicId={parseInt(topicId, 10)}
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
