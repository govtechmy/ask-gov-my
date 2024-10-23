"use client";

import Translator from "@/components/client/translator";
import { Agency, Question } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  QuestionSmileIcon,
  PlusCircleIcon,
} from "@askgovmy/ui";
import { since } from "@askgovmy/utils";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AgencyDropdown } from "./super-admin";

export default function ContentDialog({
  children,
  role,
  question,
  agencies,
}: {
  children: ReactNode;
  role: "super_admin" | "staff";
  question: Question;
  agencies: Agency[];
}) {
  const params = useParams();
  const locale = params.locale as "ms-MY" | "en-GB";
  const [open, setOpen] = useState(false);
  const questionText = useRef<HTMLSpanElement | null>(null);
  const [questionHeight, setQuestionHeight] = useState<number>();

  const handleClickTrigger = (triggers: string[], event: any) => {
    const elements = triggers
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Check if the click is inside any of the elements
    if (elements.some((element) => element.contains(event.target as Node))) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (questionText.current) {
          // Ref should now be accessible after the dialog renders
          setQuestionHeight(questionText.current.clientHeight);
        }
      }, 0);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger
          onClick={(event) => {
            const open = handleClickTrigger(
              role === "super_admin"
                ? [
                    `float-button-${question.id}`,
                    `mark-spam-button-${question.id}`,
                    `mark-spam-content-${question.id}`,
                    `portal`,
                    `question-agency-dropdown-${question.id}`,
                    `command-input-${question.id}`,
                  ]
                : [],
              event
            );

            setOpen(open);
          }}
          asChild
        >
          {children}
        </DialogTrigger>
        {role === "super_admin" && (
          <DialogContent
            hideCloseButton={true}
            onInteractOutside={() => setOpen(false)}
            className="max-w-[700px] rounded-lg gap-2"
          >
            <DialogHeader>
              <DialogTitle className="font-inter text-sm text-black-700 font-medium justify-start gap-2">
                <Translator
                  namespace="AdminQuestions.agency_dialog.title"
                  values={{ day: since(question.created_at, locale) }}
                  tag="none"
                />
                <span className="rounded-full px-2 py-1.5 bg-washed-100 text-dim-500 text-xs">
                  ID: {question.id}
                </span>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex gap-3">
              <QuestionSmileIcon height={questionHeight} />
              <span
                ref={questionText}
                className="text-base font-medium text-mydstextbrand-600 flex-1"
              >
                {question.question}
              </span>
            </DialogDescription>

            <div className="flex gap-3">
              <PlusCircleIcon />
              <div className="space-y-2">
                <Translator
                  namespace="AdminQuestions.agency_dialog.assign_to_agency"
                  className="text-sm"
                />
                <AgencyDropdown
                  agencies={agencies}
                  defaultSelected={question.agency?.id.toString() || undefined}
                  questionId={question.id.toString()}
                />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
