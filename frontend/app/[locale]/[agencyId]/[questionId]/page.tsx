import Link from 'next/link';
import { getQuestionById, getTopicsDetail } from '@/actions/questionServices';
import Header from '@/components/HeaderDetails/Header';
import Footer from '@/components/FooterDetails/Footer';
import RelatedTopics from '@/components/RelatedTopics';
import RightArrow from '@/icons/rightarrow';
import IconQuestionSmileSolo from '@/icons/iconquestionsmilesolo';
import ThumbsCounter from '@/components/ThumbsCounter';

interface Props {
  params: {
    agencyId: string;
    questionId: string;
  };
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { agencyId, questionId } = params;

  const question = await getQuestionById(questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  const topicTitles = await getTopicsDetail(question.topics);

  return (
    <div className="">
      <div className="">
        <div className="sticky top-0 z-10 bg-white border-b-[1px]">
          <div className="container"></div>
        </div>
        <div className="bg-white">
          <div className="container flex justify-center mx-auto bg-black-700">
            <Header />
          </div>
        </div>

        <div className="container mt-10 flex text-out">
          <div className="max-w-screen-2xl">
            <div className="pb-7">
              <div className="flex items-center gap-1">
                <div className="font-medium text-dim-500 text-sm">Home</div>
                <div>
                  <RightArrow></RightArrow>
                </div>
                <div className="font-medium text-black-800 text-sm">EPF</div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div>
                  <IconQuestionSmileSolo></IconQuestionSmileSolo>
                </div>
                <div className="text-black-700 text-basem font-medium">
                  Posted 5 days ago
                </div>
              </div>

              <div className="py-6 text-brand-700 font-medium text-2xl">
                How do I input health data into MySejahtera?
              </div>

              <div className="pb-6">
                <div className="bg-[#FFFFFF] border-[1px] border-outline-200 rounded-lg ">
                  <div>Card</div>
                  <div>Supporting Attachments</div>
                  <div>
                    <ThumbsCounter></ThumbsCounter>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-base pt-6">
                  Related questions
                </div>
                <div>Question Cards</div>
              </div>
            </div>
          </div>

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700">
              Related Topics
              <RelatedTopics></RelatedTopics>
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

export default QuestionDetailPage;
