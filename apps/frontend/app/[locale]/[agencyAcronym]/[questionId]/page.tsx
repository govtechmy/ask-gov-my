import {
  getQuestionById,
  getTopicsDetail,
  getAgencyList,
} from "@/actions/questionServices";
import { getRelatedQuestions } from "@/actions/searchServices";
import IconQuestionSmileSolo from "@/icons/iconquestionsmilesolo";
import ThumbsCounter from "@/components/page/QuestionDetailPage/ThumbsCounter";
import AgencyName from "@/components/common/AgencyName";
import JataNegaraIcon from "@/icons/jatanegaraicon";
import { notFound } from "next/navigation";
import Link from "next/link";
import WordTranslate from "@/components/common/WordTranslate";
import { Question } from "@/types/types";
import AgencyLogoImporter from "@/components/common/AgencyLogoImporter";
import { fetchFileSizes } from "@/actions/utils";
import TipTap from "@/components/Editor/TipTap";
import { StyledDisplay } from "@/components/ui/display";
import { FSP, inject } from "@/lib/decorator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Separator,
} from "@askgovmy/ui";
import { routes } from "@/lib/routes";
import { since } from "@askgovmy/utils";

interface QuestionDetailsProps {
  question: Question;
  relatedQuestions: Question[];
  relatedTopics: string[];
}

const QuestionDetailPage: FSP<QuestionDetailsProps> = async ({
  params,
  data,
  locale,
}) => {
  const { question, relatedQuestions, relatedTopics } = data!;
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb className="print:hidden">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={routes.home}>
                <WordTranslate translate={"Questiondetail"} keyword={"home"} />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage> {question.agency.acronym}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <IconQuestionSmileSolo />
          <div className="flex text-black-700 text-base font-medium">
            <WordTranslate translate={"Questiondetail"} keyword={"posted"} />
            &nbsp;
            {since(question.created_at, params?.locale)}
          </div>
        </div>
      </div>

      <h3 className="text-mydstextbrand-600 font-medium text-2xl">
        {question.question}
      </h3>

      <div className="bg-white rounded-xl border border-outline-200 p-4.5 lg:p-8 gap-4.5 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:items-center">
          <div className="flex lg:items-center">
            <div className="flex w-6 h-6 relative flex-shrink-0">
              <AgencyLogoImporter currentAgency={question.agency} />
            </div>
            <div className="font-medium text-sm text-black-700 px-2">
              <AgencyName agency={question.agency} />
            </div>
          </div>
          <p className="font-medium text-sm text-dim-500 flex items-center gap-1">
            <WordTranslate translate={"Questiondetail"} keyword={"answered"} />
            {since(question.answer.created_at, params?.locale)}
          </p>
        </div>
        <div className="flex text-justify text-black-700 flex-col">
          <TipTap
            editorText={question.answer.raw}
            className="w-full flex-1"
            isEditable={false}
            hasMenuBar={false}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <p className=" font-medium text-sm">Topics: </p>
          <div className="flex flex-col lg:flex-row gap-1.5">
            {relatedTopics.map((title, index) => (
              <StyledDisplay key={index} variant={"Topics"}>
                {title}
              </StyledDisplay>
            ))}
          </div>
        </div>

        <Separator className="my-1.5" />

        <div className="">
          <WordTranslate
            translate={"Questiondetail"}
            keyword={"attachment"}
            className="flex text-sm text-black-700"
          />
          {/* <div className="mx-8 mb-8 ">
              <AttachmentDownload
                uploadedAttachments={attachments}
                fileSizes={fileSize}
              ></AttachmentDownload>
            </div> */}
        </div>

        <Separator className="my-1.5 w-[calc(100%+4rem)] -mx-8" />

        <ThumbsCounter
          questionId={question.id.toString()}
          totalLikes={question.answer.likes}
        />
      </div>

      <div>
        <h6 className="font-semibold text-base pt-6 pb-2">Related questions</h6>
        <div className="w-full">
          {relatedQuestions.map((relatedQuestion, index) => (
            <Link
              href={`/${relatedQuestion.agency.acronym.toLowerCase()}/${relatedQuestion.id}`}
              key={relatedQuestion.id}
              className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-0 py-4 border-b border-outline-200 hover:rounded-md hover:bg-outline-200 px-4 -mx-4 lg:max-h-[76px]"
            >
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-medium text-sm text-black-700 line-clamp-1">
                  {relatedQuestion.question}
                </span>
                <span className="font-normal text-sm text-dim-500 line-clamp-1">
                  Answer: {relatedQuestion.answer.text}
                </span>
              </div>

              <div className="lg:pl-3">
                <div className="flex">
                  <div className="pr-1.5">
                    {/* TODO: Use agency icons instead */}
                    <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5" />
                  </div>
                  <div className="font-normal text-sm text-black-800">
                    {relatedQuestion.agency.acronym}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default inject(QuestionDetailPage, {
  // debug: true,
  async data({ searchParams, params }) {
    const agencies = await getAgencyList();

    const agencyId = agencies.find(
      (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
    )?.id;

    const question = await getQuestionById(params.questionId);

    if ("code" in question && question.code === 404) {
      return notFound();
    }

    if (!("code" in question) && agencyId) {
      const [relatedQuestions, relatedTopics] = await Promise.all([
        getRelatedQuestions(question.question),
        getTopicsDetail(question.topics, agencyId, params.locale),
      ]);
      return {
        question,
        relatedQuestions,
        relatedTopics,
      };
    }
  },
});
