"use client";

import Translator from "@/components/client/translator";
import { Link } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { Question } from "@/types/types";
import {
  Button,
  PencilIcon,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@askgovmy/ui";
import { EyeIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FC, ReactNode } from "react";

export const StaffFloatButton: FC<{ question: Question }> = ({ question }) => {
  return (
    <>
      {!question.answer?.draft && (
        <Link
          href={route("questionsDetails", {
            agencyAcronym: question.agency.acronym.toLowerCase(),
            questionId: question.id,
          })}
          target="_blank"
        >
          <Button
            id={`preview-button-${question.id}`}
            className="w-8 h-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            variant={"secondary"}
            size={"sm"}
            icon={<EyeIcon className="w-4 h-4 stroke-black-700" />}
          />
        </Link>
      )}
      <AdminAnswerDialog
        trigger={
          <Button
            id={`edit-answer-button-${question.id}`}
            className="h-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            variant={"secondary"}
            size={"sm"}
          >
            <PencilIcon className="w-4 h-4 stroke-black-700" />
            <Translator namespace="AdminQuestions.edit" tag="span" />
          </Button>
        }
        type="edit"
        question={question}
      />
    </>
  );
};

export const StaffContent: FC<{ question: Question }> = ({ question }) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("state") || "all";
  return (
    <>
      {tab === "all" && (
        <div className="w-[125px]">
          {question.answer ? (
            question.answer.draft ? (
              <Translator
                className="rounded-full gap-1.5 py-0.5 px-2 bg-washed-100 text-dim-500 w-fit"
                namespace="AdminQuestions.state.draft"
                prefix={<span className="w-2 h-2 bg-dim-500 rounded-full" />}
              />
            ) : (
              <Translator
                className="rounded-full gap-1.5 py-0.5 px-2 bg-askmygovbrand-50 text-askmygovtextbrand-600 w-fit"
                namespace="AdminQuestions.state.answered"
                prefix={
                  <span className="w-2 h-2 bg-askmygovtextbrand-600 rounded-full" />
                }
              />
            )
          ) : (
            <Translator
              className="rounded-full gap-1.5 py-0.5 px-2 bg-success-50 text-success-700 w-fit"
              namespace="AdminQuestions.new"
              prefix={<span className="w-2 h-2 bg-success-700 rounded-full" />}
            />
          )}
        </div>
      )}
      <div className="flex-1">
        <p className="font-medium text-black-700 line-clamp-1 ">
          {question.question}
        </p>
        {question.answer && (
          <p className="text-dim-500 line-clamp-1 flex-1">
            {question.answer.text}
          </p>
        )}
      </div>
    </>
  );
};

export const AdminAnswerDialog: FC<{
  trigger?: ReactNode;
  question: Question;
  type: "edit" | "create";
}> = ({ question, trigger, type }) => {
  const content = (
    <>
      <DialogHeader>
        <DialogTitle className="font-inter text-sm text-black-700 font-medium justify-start gap-2">
          <span className="rounded-full px-2 py-1.5 bg-washed-100 text-dim-500 text-xs">
            ID: {question.id} type: {type}
          </span>
        </DialogTitle>
      </DialogHeader>
    </>
  );

  if (trigger) {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-[700px] h-[700px]">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return <>{content}</>;
};
