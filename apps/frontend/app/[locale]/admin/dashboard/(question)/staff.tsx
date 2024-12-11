"use client";

import Translator from "@/components/client/translator";
import TipTap from "@/components/Editor/TipTap";
import { Link } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { Attachment, Question, Topic } from "@/types/types";
import {
  Button,
  PencilIcon,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  QuestionSmileIcon,
  WarningIcon,
  DialogFooter,
  UploadIcon,
  AttachmentIcon,
  CloseIcon,
  Popover,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  buttonVariants,
  XIcon,
  PlusIcon,
  DialogClose,
  useToast,
  Spinner,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "@askgovmy/ui";
import { cn, getTimestamp, since } from "@askgovmy/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mime from "mime-types";
import {
  assignQuestionTopic,
  createNewAnswer,
  createNewTopic,
  createQuestionAttachment,
  deleteQuestionAttachment,
  getAttachmentPresignedURL,
  updateCurrentAnswer,
} from "@/actions/admin/question";
import { useOpenQuestion } from "./use-open-question";
import { DateTime } from "luxon";

export const StaffFloatButton: FC<{ question: Question; topics: Topic[] }> = ({
  question,
  topics,
}) => {
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
        topics={topics}
      />
    </>
  );
};

export const StaffContent: FC<{ userId: string; question: Question }> = ({
  userId,
  question,
}) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("state") || "all";
  const { opened } = useOpenQuestion({ userId, questionId: question.id });

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
            !opened &&
            Math.abs(
              DateTime.fromISO(question.created_at).diffNow().as("days")
            ) < 7 && (
              <Translator
                className="rounded-full gap-1.5 py-0.5 px-2 bg-success-50 text-success-700 w-fit"
                namespace="AdminQuestions.new"
                prefix={
                  <span className="w-2 h-2 bg-success-700 rounded-full" />
                }
              />
            )
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
      {tab === "answered" && (
        <div className="bg-background border border-outline-200 rounded-md py-1.5 px-2.5 flex gap-2.5 items-center">
          <span className="flex gap-1 items-center text-success-700">
            <ThumbsUpIcon className="stroke-success-700" />
            {question.answer?.likes}
          </span>
          <span className="flex gap-1 items-center">
            <ThumbsDownIcon className="stroke-dim-500" />
            {question.answer?.dislikes}
          </span>
        </div>
      )}
    </>
  );
};

type CreateDialog = {
  type: "create";
  trigger?: ReactNode;
  question: Question;
  topics: Topic[];
  onClose?: () => void;
};

type EditDialog = {
  type: "edit";
  trigger: ReactNode;
  onClose?: () => void;
  question: Question;
  topics: Topic[];
};

type AdminAnswerDialogProps = CreateDialog | EditDialog;

export const AdminAnswerDialog: FC<AdminAnswerDialogProps> = ({
  question,
  trigger,
  type,
  topics,
  onClose,
}) => {
  const params = useParams();
  const { toast } = useToast();
  const locale = params.locale as "ms-MY" | "en-GB";
  const questionText = useRef<HTMLSpanElement | null>(null);
  const topicContainer = useRef<HTMLDivElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [answerRaw, setAnswerRaw] = useState(question.answer?.raw || "");
  const [answerText, setAnswerText] = useState(question.answer?.text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [prevFiles, setPrevFiles] = useState<Attachment[]>(
    question.attachments || []
  );
  const [selectedTopics, setSelectedTopics] = useState<number[]>(
    question.topics || []
  );
  const [questionHeight, setQuestionHeight] = useState<number>();
  useEffect(() => {
    setTimeout(() => {
      if (questionText.current) {
        // Ref should now be accessible after the dialog renders
        setQuestionHeight(questionText.current.clientHeight);
      }
    }, 0);
  }, [open]);

  const handleFileSelection = (files: FileList) => {
    const fileNames = Object.values(files).map((file) => {
      let name = `uploads/${file.name.split(".").at(0)}_${getTimestamp()}`;
      const fileExtension = mime.extension(file.type);
      if (fileExtension) {
        name += `.${fileExtension}`;
      }
      return name;
    });
    // temp state when file not uploaded yet.
    setFiles((prev) => [
      ...prev,
      ...Object.values(files).map((file, index) => ({
        file_key: fileNames[index],
        file_size: file.size,
        id: 0,
      })),
    ]);

    Object.values(files).forEach(async (file, index) => {
      try {
        // 1. get presigned url
        const { uploadUrl } = await getAttachmentPresignedURL({
          fileType: file.type,
          fileName: fileNames[index],
          fileSize: file.size,
        });

        // 2. upload the attachment create endpoint
        const res = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Disposition": "inline",
          },
        });

        if (!res.ok) return;
        const { error, message, data } = await createQuestionAttachment({
          question: question.id,
          file_key: fileNames[index],
          file_size: file.size,
        });

        if (error) return;
        // 3. set individual state to full data with id
        setFiles((prev) => [
          ...prev.filter(
            (file) => !(file.id === 0 && file.file_key === data.file_key)
          ),
          data,
        ]);
      } catch (error) {
        console.error("here", error);
        return error;
      }
    });
  };

  const getContentOffset = () => {
    const base = 18;
    const line = Math.ceil(selectedTopics.length / 4) || 1;
    return -(base + line * 28);
  };

  const remainingTopic = useMemo(() => {
    return topics.filter((topic) => !selectedTopics.includes(topic.id));
  }, [selectedTopics, topics]);

  const handleAddTopic = async () => {
    const { message, error, data } = await createNewTopic(
      { title: topicSearch },
      locale
    );

    if (error) return;

    setSelectedTopics((prev) => [...prev, data.id]);
    setTopicSearch("");
  };

  const handleDeleteUploadedAttachment = async (id: string) => {
    const { message, error, data } = await deleteQuestionAttachment(id);

    if (error) return;

    setPrevFiles((prev) => prev.filter((file) => file.id.toString() !== id));
  };

  const handleSubmitAnswer = async (draft: boolean) => {
    if (!draft) {
      setIsSubmitting(true);
    }
    if (type === "create") {
      const [{ error: errorAnswer, message }, { error: errorTopic }] =
        await Promise.all([
          createNewAnswer({
            question: question.id,
            raw: answerRaw,
            text: answerText,
            draft,
          }),
          assignQuestionTopic(question.id.toString(), {
            topics: selectedTopics.map((top) => top),
          }),
        ]);

      if (errorAnswer || errorTopic) {
        toast({
          variant: "error",
          title: errorAnswer || errorTopic,
          description: message,
        });
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        toast({
          variant: "success",
          title: (
            <Translator namespace="AdminQuestions.answer_dialog.successful" />
          ),
        });
      }
    }

    if (type === "edit") {
      const [
        { error: errorAnswer, message },
        { error: errorTopic, message: me },
      ] = await Promise.all([
        updateCurrentAnswer(question.answer!.id.toString(), {
          question: question.id,
          raw: answerRaw,
          text: answerText,
          draft,
        }),
        assignQuestionTopic(question.id.toString(), {
          topics: selectedTopics.map((top) => top),
        }),
      ]);

      if (errorAnswer || errorTopic) {
        toast({
          variant: "error",
          title: errorAnswer || errorTopic,
          description: message,
        });
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        toast({
          variant: "success",
          title: (
            <Translator namespace="AdminQuestions.answer_dialog.successful" />
          ),
        });
      }
    }
  };

  const content = (
    <>
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
        <DialogDescription className="flex gap-3">
          <QuestionSmileIcon height={questionHeight} />
          <span
            ref={questionText}
            className="text-base font-medium text-mydstextbrand-600 flex-1"
          >
            {question.question}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-3 h-full flex-1 overflow-hidden">
        <div className="w-7 h-7 aspect-square rounded-full border-outline-200 border overflow-hidden relative">
          {question.agency.logo_url && (
            <Image
              unoptimized
              src={question.agency.logo_url}
              alt={question.agency.name}
              fill
              className="object-contain"
            />
          )}
        </div>

        <div className="space-y-3 flex-1 self-stretch overflow-scroll hide-scrollbar">
          {question.answer && !question.answer.draft && (
            <div className="flex items-center py-3 px-4 bg-warning-50 border border-warning-300 text-warning-700 text-sm font-medium rounded-lg gap-3">
              <WarningIcon />
              <Translator
                namespace="AdminQuestions.answer_dialog.updating_published_text"
                values={{ day: since(question.answer?.created_at, locale) }}
              />
            </div>
          )}
          <TipTap
            editorText={answerRaw}
            setEditorText={(raw, text) => {
              setAnswerRaw(raw);
              setAnswerText(text);
            }}
            className={cn(
              "flex flex-col divide-y rounded-lg w-full h-[250px] border-[1px] shadow-button overflow-y-auto relative",
              isSubmitting && "bg-washed-100"
            )}
          />
          <div className="border p-4 space-y-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-1">
                <Translator
                  namespace="AdminQuestions.answer_dialog.supporting_attachments"
                  className="font-medium"
                />
                <Translator
                  namespace="AdminQuestions.answer_dialog.attachment_size"
                  className="text-sm text-dim-500 flex flex-col items-start"
                  prefix={
                    <Translator
                      tag="span"
                      namespace="AdminQuestions.answer_dialog.attachment_format"
                    />
                  }
                />
              </div>

              <Button
                disabled={isSubmitting}
                onClick={() => fileInput.current?.click()}
                icon={<UploadIcon />}
              >
                <Translator
                  namespace="AdminQuestions.answer_dialog.upload_file"
                  tag="none"
                  className="font-medium"
                />
                <input
                  type="file"
                  ref={fileInput}
                  multiple={true}
                  accept=".jpg, .jpeg, .png, .webp, .pdf"
                  onChange={async (e) => {
                    const fileList = e.target.files;
                    if (fileList) handleFileSelection(fileList);
                  }}
                  className="hidden"
                />
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "px-3 py-2 w-[180px] flex items-center gap-1.5 bg-white-focuswhite100 border border-outline-300 rounded-lg",
                    file.id === 0 && "opacity-40"
                  )}
                >
                  <AttachmentIcon
                    type={
                      mime.lookup(file.file_key) || "application/octet-stream"
                    }
                  />
                  <p className="flex flex-col flex-1 line-clamp-2">
                    <span className="line-clamp-1 text-sm">
                      {file.file_key.split("/").at(-1)}
                    </span>
                    <span className="text-xs text-dim-500">
                      {file.file_size < 1e6
                        ? `${(file.file_size / 1e3).toFixed(1)} KB`
                        : `${(file.file_size / 1e6).toFixed(1)} MB`}
                    </span>
                  </p>
                  <Button
                    disabled={file.id === 0}
                    variant={"cancel-box-red"}
                    className="size-8"
                    icon={<CloseIcon className="stroke-danger-600" />}
                    onClick={() =>
                      setFiles(files.filter((f, index) => index !== idx))
                    }
                  />
                </div>
              ))}
            </div>
            {prevFiles.length > 0 && (
              <div className="border-t space-y-3 pt-3">
                <Translator
                  namespace="AdminQuestions.answer_dialog.previously_uploaded"
                  className="text-sm text-dim-500"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  {prevFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 w-[180px] flex items-center gap-1.5 bg-white-focuswhite100 border border-outline-300 rounded-lg"
                    >
                      <AttachmentIcon
                        type={
                          mime.lookup(file.file_key) ||
                          "application/octet-stream"
                        }
                      />
                      <p className="flex flex-col flex-1 line-clamp-2">
                        <span className="line-clamp-1 text-sm ">
                          {file.file_key.split("/").at(-1)}
                        </span>
                        <span className="text-xs text-dim-500">
                          {file.file_size < 1e6
                            ? `${(file.file_size / 1e3).toFixed(1)} KB`
                            : `${(file.file_size / 1e6).toFixed(1)} MB`}
                        </span>
                      </p>
                      <Button
                        variant={"cancel-box-red"}
                        className="size-8"
                        icon={<CloseIcon className="stroke-danger-600" />}
                        onClick={async () => {
                          await handleDeleteUploadedAttachment(
                            file.id.toString()
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5" ref={topicContainer}>
            <Translator namespace="Topics.topic" className="font-medium" />
            <Popover
              trigger={
                <div className="flex items-center w-full bg-white-forcewhite shadow-button rounded-lg border gap-2 px-3 py-2 text-sm focus:border focus:border-askmygovbrand-300  focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 // focus:ring-0 flex-wrap">
                  {selectedTopics.map((topic) => {
                    const _topic = topics.find((t) => t.id === topic);

                    // Topic isn't in the list of availble topics
                    if (!_topic) {
                      return null;
                    }

                    return (
                      <div
                        key={topic}
                        className={cn(
                          "h-7 max-w-[140px] rounded-lg border border-askmygovbrand-300 py-1 px-2.5 gap-1 bg-askmygovbrand-50 shadow-button text-askmygovtextbrand-600 flex items-center"
                        )}
                      >
                        <span className="flex-1 line-clamp-1">
                          {_topic.title}
                        </span>
                        <CloseIcon
                          onClick={() => {
                            setSelectedTopics((prev) =>
                              prev.filter((t) => t !== topic)
                            );
                          }}
                          className="stroke-askmygovtextbrand-600"
                        />
                      </div>
                    );
                  })}
                  <Translator
                    namespace="Topics.add_or_search"
                    className="text-dim-500 whitespace-nowrap"
                    tag="span"
                  />
                </div>
              }
              portalContainer={topicContainer.current as HTMLElement}
              option={{ sideOffset: getContentOffset(), side: "top" }}
            >
              {(setOpen) => (
                <Command
                  className="w-full"
                  filter={(value, _search) => {
                    const search = _search.toLowerCase();
                    const item = topics.find(
                      (topic) => topic.id.toString() === value
                    );
                    return item?.title.toLowerCase().includes(search) ? 1 : 0;
                  }}
                >
                  <CommandList className="PopoverContent">
                    <CommandEmpty className="text-start text-sm flex flex-col gap-2 text-dim-500">
                      <Translator
                        namespace="Topics.notfound2"
                        className="max-w-full px-2"
                      />
                      <Button
                        onClick={async () => {
                          await handleAddTopic();
                          setOpen(false);
                        }}
                        variant={"tertiary-dropdown"}
                        icon={<PlusIcon className="stroke-dim-500" />}
                      >
                        <span className="px-2 flex-1">{topicSearch}</span>
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {remainingTopic.map((topic) => (
                        <CommandItem
                          key={topic.id}
                          value={topic.id.toString()}
                          onSelect={(topic) => {
                            setSelectedTopics((prev) => [
                              ...prev,
                              topics.find((t) => t.id.toString() === topic)!.id,
                            ]);
                            setOpen(false);
                            // handleSelectAgency(agency);
                          }}
                          className="gap-2"
                        >
                          <span className="font-medium text-sm">
                            {topic.title}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <CommandInput
                    placeholder="Search"
                    value={topicSearch}
                    onValueChange={setTopicSearch}
                  />
                </Command>
              )}
            </Popover>
          </div>
        </div>
      </div>
      <DialogFooter className="flex mt-4 flex-row gap-2 justify-end border-t border-outline-200 pt-6">
        <DialogClose asChild>
          <Button
            className="w-fit"
            type="button"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
          >
            <Translator namespace="AdminQuestions.answer_dialog.cancel" />
          </Button>
        </DialogClose>
        <Button
          variant={"secondary-myds"}
          className="w-fit"
          type="button"
          onClick={() => handleSubmitAnswer(true)}
        >
          <Translator namespace="AdminQuestions.answer_dialog.save_draft" />
        </Button>
        <Button
          variant={"primary"}
          className="w-fit"
          type="button"
          onClick={() => handleSubmitAnswer(false)}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <Translator namespace="AdminQuestions.answer_dialog.publish" />
          )}
        </Button>
      </DialogFooter>
    </>
  );

  if (trigger) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) onClose?.();
          setOpen(open);
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="max-w-[700px] h-[724px] max-h-[724px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return <>{content}</>;
};
