"use client";

import Translator from "@/components/client/translator";
import { Agency, Question, Topic } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  QuestionSmileIcon,
  PlusCircleIcon,
  DialogClose,
  XIcon,
} from "@askgovmy/ui";
import { since } from "@askgovmy/utils";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AgencyDropdown } from "./super-admin";
import { AdminAnswerDialog } from "./staff";

export default function ContentDialog({
  children,
  role,
  question,
  agencies,
  topics,
}: {
  children: ReactNode;
  role: "super_admin" | "staff";
  question: Question;
  agencies: Agency[];
  topics: Topic[];
}) {
  const params = useParams();
  const locale = params.locale as "ms-MY" | "en-GB";
  const [open, setOpen] = useState(false);
  const questionText = useRef<HTMLSpanElement | null>(null);
  const dropdownContainer = useRef<HTMLDivElement | null>(null);
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
                : role === "staff"
                  ? [
                      `preview-button-${question.id}`,
                      `edit-answer-button-${question.id}`,
                      `portal`,
                    ]
                  : [],
              event
            );

            if (role === "super_admin") {
              setOpen(open);
            }

            if (role === "staff") {
              if (!question.answer) {
                setOpen(open);
              }
            }
          }}
          asChild
        >
          {children}
        </DialogTrigger>
        {role === "staff" && (
          <DialogContent
            hideCloseButton={true}
            onInteractOutside={() => setOpen(false)}
            className="max-w-[700px] h-[700px] max-h-[700px] rounded-lg gap-2 flex flex-col"
          >
            <AdminAnswerDialog
              question={question}
              type="create"
              trigger={undefined as never}
              topics={topics}
              setOpen={setOpen}
            />
            <DialogClose
              onClick={() => setOpen(false)}
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-background data-[state=open]:text-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        )}
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
              <div className="space-y-2" ref={dropdownContainer}>
                <Translator
                  namespace="AdminQuestions.agency_dialog.assign_to_agency"
                  className="text-sm"
                />
                <AgencyDropdown
                  agencies={agencies}
                  defaultSelected={question.agency?.id.toString() || undefined}
                  questionId={question.id.toString()}
                  portalRef={dropdownContainer.current}
                />
              </div>
            </div>

            <DialogClose
              onClick={() => setOpen(false)}
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-background data-[state=open]:text-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
