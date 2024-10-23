"use client";
import { Link } from "@/lib/i18n";
import DateComponent from "../Date";
import LikeIcon from "@/icons/likeicon";
import AgencyLogoImporter from "../AgencyLogoImporter";
import { Question } from "@/types/types";
import AgencyName from "../AgencyName";
import { QuestionSmileIcon } from "@askgovmy/ui";
import { useEffect, useRef, useState } from "react";

interface QuestionCardProps {
  question: Question;
  locale: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, locale }) => {
  const questionText = useRef<HTMLSpanElement | null>(null);
  const [questionHeight, setQuestionHeight] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      if (questionText.current) {
        // Ref should now be accessible after the dialog renders
        setQuestionHeight(questionText.current.clientHeight);
      }
    }, 0);
  }, []);

  return (
    <Link
      className="cursor-pointer bg-white rounded-md border p-5 shadow-sm flex flex-col gap-2"
      href={`/${question?.agency?.acronym?.toLowerCase()}/${question.id}`}
    >
      <div className="flex gap-2">
        <QuestionSmileIcon height={questionHeight} />

        <span
          ref={questionText}
          className="flex-1 text-base font-medium text-mydstextbrand-600"
        >
          {question.question}
        </span>
      </div>

      <div className="flex items-center font-medium text-sm gap-2">
        <div className="w-6 h-6 flex relative flex-shrink-0">
          {question.agency && (
            <AgencyLogoImporter currentAgency={question.agency} />
          )}
        </div>

        {question.agency && <AgencyName agency={question.agency} />}
        <div className="font-normal text-sm text-dim-500 break whitespace-nowrap">
          <DateComponent date={question.created_at} locale={locale} />
        </div>
      </div>

      <div
        className="ml-8 font-normal text-black-700 text-justify line-clamp-2 max-w-[900px]"
        style={{ fontSize: "14px", lineHeight: "22px" }}
      >
        {question.answer.text}
      </div>
      <div className="ml-8 flex items-center">
        <div className="mr-2">
          <LikeIcon />
        </div>
        <div className="mr-1 font-semibold text-sm text-dim-500">
          {question.answer.likes}
        </div>
        <div className="font-normal text-sm text-dim-500">
          people found this useful
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
