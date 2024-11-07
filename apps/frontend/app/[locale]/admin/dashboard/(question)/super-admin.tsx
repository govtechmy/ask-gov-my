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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  SelectIcon,
  ChevronDownIcon,
} from "@askgovmy/ui";
import { FC, Dispatch, SetStateAction, useState } from "react";
import { Agency, Question, Topic } from "@/types/types";
import Translator from "@/components/client/translator";
import { cn } from "@askgovmy/utils";
import {
  assignAgencyToQuestion,
  markQuestionSpam,
} from "@/actions/admin/question";
import { DateTime } from "luxon";
import { Check, PencilIcon } from "lucide-react";
import { AdminAnswerDialog } from "./staff";

// This file has the responsibility to render "super-admin" role specific render for admin questions

export const AdminContent: FC<{ question: Question; agencies: Agency[] }> = ({
  question,
  agencies,
}) => {
  return (
    <div className="flex lg:items-center flex-1 gap-3 flex-col-reverse lg:flex-row">
      <p className="font-medium text-black-700 line-clamp-2 flex-1">
        {question.question}
      </p>
      <div className="flex gap-3 items-center">
        {question.answer &&
          (question.answer.draft ? (
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
          ))}
        {question.spam ? (
          <Translator
            className="rounded-full gap-1.5 py-0.5 px-2 bg-danger-50 text-danger-700"
            namespace="AdminQuestions.state.spam"
            prefix={<span className="w-2 h-2 bg-danger-700 rounded-full" />}
          />
        ) : (
          !question.admin_opened_at &&
          Math.abs(DateTime.fromISO(question.created_at).diffNow().as("days")) <
            7 && (
            <Translator
              className="rounded-full gap-1.5 py-0.5 px-2 bg-success-50 text-success-700"
              namespace="AdminQuestions.new"
              prefix={<span className="w-2 h-2 bg-success-700 rounded-full" />}
            />
          )
        )}
        <AgencyDropdown
          agencies={agencies}
          defaultSelected={question.agency?.id.toString() || undefined}
          questionId={question.id.toString()}
        />
      </div>
    </div>
  );
};

export const AdminFloatButton: FC<{ question: Question; topics: Topic[] }> = ({
  question,
  topics,
}) => {
  return (
    <Popover
      trigger={
        <Button
          id={`float-button-${question.id}`}
          className="w-8 h-8 p-1.5 hover:cursor-pointer z-10 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
          variant={"secondary"}
          size={"sm"}
          icon={<ThreeDottedIcon className="w-4 h-4 stroke-black-700" />}
        />
      }
      option={{ align: "end", alignOffset: 0, sideOffset: 4 }}
      className=""
    >
      {(setOpenPopover) => (
        <>
          {!question.answer && question.agency && (
            <AdminAnswerDialog
              question={question}
              type="create"
              trigger={
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant={"tertiary-dropdown"}
                  size={"sm"}
                >
                  <PencilIcon className="w-4 h-4 stroke-black-700" />
                  <Translator namespace="AdminQuestions.answer" tag="span" />
                </Button>
              }
              topics={topics}
              onClose={() => setOpenPopover(false)}
            />
          )}
          {question.answer && (
            <AdminAnswerDialog
              question={question}
              type="edit"
              trigger={
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant={"tertiary-dropdown"}
                  size={"sm"}
                >
                  <PencilIcon className="w-4 h-4 stroke-black-700" />
                  <Translator namespace="AdminQuestions.edit" tag="span" />
                </Button>
              }
              topics={topics}
              onClose={() => setOpenPopover(false)}
            />
          )}
          {question.spam ? (
            <MarkSpamDialog
              questionId={question.id.toString()}
              type="unspam"
              closePopover={setOpenPopover}
            />
          ) : (
            <MarkSpamDialog
              questionId={question.id.toString()}
              type="spam"
              closePopover={setOpenPopover}
            />
          )}
        </>
      )}
    </Popover>
  );
};

export const MarkSpamDialog: FC<{
  questionId: string;
  type: "spam" | "unspam";
  closePopover: Dispatch<SetStateAction<boolean>>;
}> = ({ questionId, type, closePopover }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id={`mark-spam-button-${questionId}`}
          variant={"tertiary-dropdown"}
          className="text-sm font-medium"
        >
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
      <DialogContent
        onInteractOutside={() => closePopover(false)}
        id={`mark-spam-content-${questionId}`}
        className="max-w-[400px] rounded-lg"
      >
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

export const AgencyDropdown: FC<{
  agencies: Agency[];
  defaultSelected?: string;
  questionId: string;
  portalRef?: any;
}> = ({ agencies, defaultSelected, questionId, portalRef }) => {
  const { toast } = useToast();
  const [dropdownValue, setDropdownValue] = useState<string>(
    defaultSelected || "unassigned"
  );

  const selectedAgency =
    dropdownValue !== "unassigned"
      ? agencies.find((agency) => agency.id.toString() === dropdownValue)
      : undefined;

  const handleSelectAgency = async (agency: string) => {
    if (agency === dropdownValue) return;

    const { error, message } = await assignAgencyToQuestion({
      id: questionId,
      agency: agency === "unassigned" ? null : Number(agency),
    });

    if (error) {
      toast({
        variant: "error",
        title: error,
        description: message,
      });
    } else {
      toast({
        variant: "success",
        title:
          agency === "unassigned" ? (
            <Translator
              namespace={"AdminQuestions.agency_dropdown.successful_unassigned"}
            />
          ) : (
            <Translator
              namespace={"AdminQuestions.agency_dropdown.successful"}
              values={{
                acronym: agencies.find(
                  (_agency) => _agency.id.toString() === agency
                )?.acronym,
              }}
            />
          ),
      });
    }
  };
  return (
    <Popover
      trigger={
        <Button
          id={`question-agency-dropdown-${questionId}`}
          variant="secondary"
          className="h-8 w-[160px] text-sm focus:outline-none overflow-hidden flex items-center justify-start sm:px-1.5"
        >
          <span className="flex-1">
            {dropdownValue === "unassigned" ? (
              <Translator
                namespace="AdminQuestions.agency_dropdown.unassigned"
                tag="none"
              />
            ) : (
              selectedAgency?.acronym
            )}
          </span>

          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </Button>
      }
      option={{
        side: "bottom",
        align: "start",
        sideOffset: -40,
      }}
      portalContainer={portalRef}
    >
      {(setOpen) => (
        <Command
          id={`command-input-${questionId}`}
          filter={(value, _search) => {
            const search = _search.toLowerCase();
            if (value === "unassigned") return value.includes(search) ? 1 : 0;
            const item = agencies.find(
              (agency) => agency.id.toString() === value
            );
            return item?.name.toLowerCase().includes(search) ||
              item?.acronym.toLowerCase().includes(search)
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder="Search" />
          <CommandList className="w-[311px]">
            <CommandEmpty>
              <Translator
                namespace="AdminQuestions.agency_dropdown.not_found"
                className="max-w-[311px]"
              />
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={"unassigned"}
                onSelect={(agency) => {
                  setDropdownValue(agency);
                  setOpen(false);
                  handleSelectAgency(agency);
                }}
                className="gap-2"
              >
                <Translator
                  className="font-medium flex-1"
                  namespace="AdminQuestions.agency_dropdown.unassigned"
                  tag="span"
                />

                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-askmygovbrand-600",
                    dropdownValue === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {agencies.map((agency) => (
                <CommandItem
                  key={agency.id}
                  value={agency.id.toString()}
                  onSelect={(agency) => {
                    setDropdownValue(agency);
                    setOpen(false);
                    handleSelectAgency(agency);
                  }}
                  className="gap-2"
                >
                  <span className="font-medium">{agency.acronym}</span>
                  <span className="flex-1 w-full line-clamp-1 text-dim-500">
                    {agency.name}
                  </span>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-askmygovbrand-600",
                      dropdownValue === agency.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </Popover>
  );
};
