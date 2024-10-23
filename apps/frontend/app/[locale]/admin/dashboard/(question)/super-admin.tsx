"use client";

import {
  Button,
  Popover,
  ThreeDottedIcon,
  useToast,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlarmTriangleIcon,
  TickCheckCircleIcon,
} from "@askgovmy/ui";
import { FC, Dispatch, SetStateAction, useState } from "react";
import { Question } from "@/types/types";
import Translator from "@/components/client/translator";
import { cn } from "@askgovmy/utils";
import { markQuestionSpam } from "@/actions/admin/question";

// This file has the responsibility to render "super-admin" role specific render for admin questions

export const AdminFloatButton: FC<{ question: Question }> = ({ question }) => {
  return (
    <Popover
      trigger={
        <Button
          className="w-8 h-8 p-1.5 hover:cursor-pointer z-10 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
          variant={"secondary"}
          size={"sm"}
          icon={<ThreeDottedIcon className="w-4 h-4 stroke-black-700" />}
        />
      }
      option={{ align: "end", alignOffset: 0, sideOffset: 4 }}
      className=""
    >
      {(setOpen) =>
        question.spam ? (
          <MarkSpamDialog
            questionId={question.id.toString()}
            type="unspam"
            closePopover={setOpen}
          />
        ) : (
          <MarkSpamDialog
            questionId={question.id.toString()}
            type="spam"
            closePopover={setOpen}
          />
        )
      }
    </Popover>
  );
};

export const MarkSpamDialog = ({
  questionId,
  type,
  closePopover,
}: {
  questionId: string;
  type: "spam" | "unspam";
  closePopover: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"tertiary-dropdown"} className="text-sm font-medium">
          {type === "spam" ? (
            <AlarmTriangleIcon className="stroke-foreground-danger" />
          ) : (
            <TickCheckCircleIcon className="stroke-black-900" />
          )}
          <Translator
            namespace={
              type === "spam"
                ? "AdminQuestions.mark_spam"
                : "AdminQuestions.unmark_spam"
            }
            className={cn(
              type === "spam" && "text-foreground-danger",
              type === "unspam" && "text-black-700"
            )}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] rounded-lg">
        <DialogHeader>
          <DialogTitle>
            <Translator
              namespace={
                type === "spam"
                  ? "AdminQuestions.spam_dialog.title_spam"
                  : "AdminQuestions.spam_dialog.title_unspam"
              }
              tag="none"
            />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Translator
            namespace="AdminQuestions.spam_dialog.description"
            tag="none"
          />
        </DialogDescription>
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          <DialogClose asChild>
            <Button onClick={() => closePopover(false)}>
              <Translator namespace="AdminQuestions.spam_dialog.cancel" />
            </Button>
          </DialogClose>
          <Button
            variant={type === "spam" ? "danger-primary" : "primary"}
            onClick={async () => {
              const { error, message } = await markQuestionSpam({
                id: questionId,
                spam: type === "spam" ? true : false,
              });
              closePopover(false);
              if (error) {
                toast({
                  variant: "error",
                  title: error,
                  description: message,
                });
              } else {
                toast({
                  variant: "success",
                  title: (
                    <Translator
                      namespace={
                        type === "spam"
                          ? "AdminQuestions.spam_dialog.successful_spam"
                          : "AdminQuestions.spam_dialog.successful_unspam"
                      }
                    />
                  ),
                });
              }
              setOpen(false);
            }}
          >
            <Translator
              namespace={
                type === "spam"
                  ? "AdminQuestions.mark_spam"
                  : "AdminQuestions.unmark_spam"
              }
              tag="span"
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
