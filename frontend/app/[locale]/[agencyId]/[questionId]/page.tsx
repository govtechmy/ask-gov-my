import { getQuestionById, getTopicsDetail } from '@/actions/questionServices';
import Header from '@/components/HeaderDetails/Header';
import Footer from '@/components/FooterDetails/Footer';
import RelatedTopics from '@/components/RelatedTopics';
import RightArrow from '@/icons/rightarrow';
import IconQuestionSmileSolo from '@/icons/iconquestionsmilesolo';
import ThumbsCounter from '@/components/ThumbsCounter';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Pdf from '@/icons/pdf';
import LocaleParams from '@/components/LocaleParams';

interface Props {
  params: {
    agencyId: string;
    questionId: string;
  };
  question: Question;
}

interface Question {
  topics: string;
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { agencyId, questionId } = params;

  const question = await getQuestionById(questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  const topicTitles = await getTopicsDetail(question.topics);

  const topics = topicTitles.map(title => title.match(/Topic \d+/)?.[0] ?? '');

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

        <div>
          HAHAHAHAHAHAHAHAHHAHAH<LocaleParams></LocaleParams>
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
                {question.question}
              </div>

              <div className="pb-6 max-w-[932px]">
                <div className="bg-[#FFFFFF] dark:bg-[#1D1D21] border-[1px] border-outline-200 rounded-lg ">
                  <div>
                    <div className="">
                      <div className="flex px-8 pt-8 pb-0 items-center">
                        <div className="w-6 h-6">
                          <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A]"></JataNegaraIcon>
                        </div>
                        <div className="font-medium text-sm text-black-700 px-2">
                          Ministry of Health (MOH)
                        </div>
                        <div className="font-medium text-sm text-dim-500">
                          Answered 1 year ago
                        </div>
                      </div>
                      <div className="flex px-8 pb-5 pt-4 text-justify text-black-700">
                        {question.answer}
                      </div>

                      <div className="px-8 pb-8 pt-0">
                        <div className="flex gap-3 items-center border-b-[1px] border-outline-200 pb-[22px]">
                          <div className=" font-medium text-sm">Topics: </div>
                          <div className="flex gap-[6px]">
                            {topicTitles.map((TopicTitles, index) => (
                              <div
                                className="flex text-base font-medium text-[#702FF9] dark:text-[#9E70FF] bg-[#F4EFFF] dark:bg-[#201636] border-[1px] border-[#D4C0FF] dark:border-[#4F1FB4] px-2 py-1 rounded-lg"
                                key={index}
                              >
                                {TopicTitles}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="px-8 pb-8 pt-0">
                      Supporting Attachments:
                    </div>
                    <div className="px-8 pb-8 pt-0">
                      <div className="flex gap-2">
                        <div className="items-center border-[1px] border-outline-200 bg-white rounded-lg flex w-[200px] h-[54px]">
                          <div className="p-2">
                            <Pdf></Pdf>
                          </div>
                          <div className="">
                            <div className="font-normal text-sm text-black-900 truncate w-[140px]">
                              KKM 2024-06-05 PAPER CONF
                            </div>
                            <div className="font-normal text-sm text-dim-500">
                              1.2MB
                            </div>
                          </div>
                        </div>
                        <div className="items-center border-[1px] border-outline-200 bg-white rounded-lg flex w-[200px] h-[54px]">
                          <div className="p-2">
                            <Pdf></Pdf>
                          </div>
                          <div className="">
                            <div className="font-normal text-sm text-black-900 truncate w-[140px]">
                              KKM 2024-06-05 PAPER CONF
                            </div>
                            <div className="font-normal text-sm text-dim-500">
                              1.2MB
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

{
  /* <div className="mt-6">
  <p>Can&apos;t find what you&apos;re looking for?</p>
  <Link href={`/questions/new`}>
    <button className="ml-2 rounded bg-blue-500 px-4 py-2 text-white">
      Ask a Question
    </button>
  </Link>
</div>; 

THIS ONE USE IN THE CLICK TO ASK QUESTION PART
*/
}
