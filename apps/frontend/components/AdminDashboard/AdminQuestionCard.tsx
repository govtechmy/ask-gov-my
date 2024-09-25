import { useState, useEffect } from "react";
import {
  assignAgencyToQuestion,
  changeAdminIsOpen,
  markQuestionAsSpam,
  unassignAgencyFromQuestion,
  unSpamQuestion,
} from "@/actions/userServices";
import NewUpdateIcon from "@/icons/new";
import { Question } from "@/types/types";
import ModalQuestionCard from "./ModalQuestionCard";
import SpamUpdateIcon from "@/icons/spam";
import { useSearchParams } from "next/navigation";
import ThreeDottedAction from "./ThreeDottedAction";
import AlarmTriangle from "@/icons/alarmtriangle";
import TickCheckCircle from "@/icons/tickcheckcircle";
import { formatDate } from "@/actions/utils";
import { Agency } from "@/types/types";
import Toast from "@/components/ui/toast";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { AgencySearchList } from "./AgencySearchList";
import { Button } from "@/components/ui/button";
import ChevronDown from "@/icons/ChevronDown";

interface QuestionCardProps {
  question: Question;
  activeQuestionId: number | null;
  setactiveQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
  agencyMap: Record<string, string>;
  agencies: Agency[];
}

const AdminQuestionCard: React.FC<QuestionCardProps> = ({
  question,
  activeQuestionId,
  setactiveQuestionId,
  agencyMap,
  agencies,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<string>("Unassigned");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSpamToast, setShowSpamToast] = useState(false);
  const [showUnSpamToast, setShowUnSpamToast] = useState(false);
  const [openAgencyPopover, setOpenAgencyPopover] = useState(false);

  useEffect(() => {
    if (question.agency !== null) {
      const matchedAgency = agencies.find(
        (agency) => agency.id === question.agency
      );
      if (matchedAgency) {
        setSelectedAgency(matchedAgency.acronym);
      }
    }
  }, [question.agency, agencies]);

  const handleCardClick = async () => {
    setIsModalOpen(true);
    if (!question.admin_isopen) {
      try {
        await changeAdminIsOpen(question.id);
        question.admin_isopen = true;
      } catch (error) {
        console.error("Failed to change admin_isopen:", error);
      }
    }
  };

  const handleMarkAsSpamToast = () => {
    setShowSpamToast(true);
  };

  const handleUnSpamToast = () => {
    setShowUnSpamToast(true);
  };

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  return (
    <>
      <div className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between w-full group">
        <div className="flex items-center">
          <div
            className="text-sm font-medium text-black-700 line-clamp-2 hover:cursor-pointer"
            onClick={handleCardClick}
          >
            {question.question}
          </div>
        </div>
        <div className="flex items-center">
          <div>
            {question.state === "spam" && (
              <div className="w-16 h-8 items-center justify-center flex">
                <SpamUpdateIcon
                  classNamePath="fill-[#FEF2F2] dark:fill-[#2B0707]"
                  classNameCircle="fill-[#DC2626] dark:fill-[#FF5959]"
                  classNamePath2="fill-[#DC2626] dark:fill-[#FF5959]"
                ></SpamUpdateIcon>
              </div>
            )}
            {question.admin_isopen === false && question.state !== "spam" && (
              <div className="w-16 h-8 items-center justify-center flex">
                <NewUpdateIcon
                  classNamePath="fill-[#F0FDF4] dark:fill-[#052E16]"
                  classNameCircle="fill-[#15803D] dark:fill-[#16A34A]"
                  classNamePath2="fill-[#15803D] dark:fill-[#16A34A]"
                />
              </div>
            )}
            {question.admin_isopen === true && question.state !== "spam" && (
              <div className="h-[22px] w-[55px]"></div>
            )}
          </div>

          <Popover open={openAgencyPopover} onOpenChange={setOpenAgencyPopover}>
            <PopoverTrigger asChild>
              <Button className="w-[130px]" size="sm">
                {selectedAgency}
                <ChevronDown className="ml-auto h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 rounded-[14px] md:min-w-[320px]"
              align="start"
            >
              <AgencySearchList
                agencies={agencies}
                onSelect={async (agency) => {
                  setOpenAgencyPopover(false);
                  if (!agency) {
                    await unassignAgencyFromQuestion(question.id);
                    return;
                  }
                  await assignAgencyToQuestion(question.id, agency.id);
                }}
                nullItemLabel="Unassigned"
              />
            </PopoverContent>
          </Popover>

          <div className="font-normal text-sm text-dim-500 w-[180px] pl-3 ">
            {formatDate(question.date)}
          </div>
          <div>
            {activeTab === "spam" ? (
              // For Mark as Not Spam
              <ThreeDottedAction
                question={question}
                handleActionToast={handleUnSpamToast}
                actionFunction={unSpamQuestion}
                actionText="Mark as not spam"
                actionIcon={<TickCheckCircle />}
                dialogTitle="Mark question as not spam?"
                dialogDescription="Are you sure to mark this question as not spam?"
                confirmButtonText="Mark as Not Spam"
                confirmButtonVariant="primary"
                newState="backlog"
              />
            ) : (
              // For Mark as Spam
              <ThreeDottedAction
                question={question}
                handleActionToast={handleMarkAsSpamToast}
                actionFunction={markQuestionAsSpam}
                actionText="Mark As Spam"
                actionIcon={<AlarmTriangle />}
                dialogTitle="Mark question as spam?"
                dialogDescription="Are you sure to mark this question as spam?"
                confirmButtonText="Mark as Spam"
                confirmButtonVariant="danger-primary"
                newState="spam"
              />
            )}
          </div>
        </div>
      </div>

      <ModalQuestionCard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={question}
        selectedAgency={selectedAgency}
        setSelectedAgency={setSelectedAgency}
        AGENCY_TO_UUID={agencyMap}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        agencies={agencies}
      />
      {showSpamToast && (
        <Toast
          message="Question marked as spam"
          icon={<TickCheckCircle />}
          underlineColor="bg-[#16A34A]"
          messageColor="text-[#15803D] dark:text-[#16A34A]"
          show={showSpamToast}
          onClose={() => setShowSpamToast(false)}
        />
      )}
      {showUnSpamToast && (
        <Toast
          message="Question marked as not spam"
          icon={<TickCheckCircle />}
          underlineColor="bg-[#16A34A]"
          messageColor="text-[#15803D] dark:text-[#16A34A]"
          show={showUnSpamToast}
          onClose={() => setShowUnSpamToast(false)}
        />
      )}
    </>
  );
};

export default AdminQuestionCard;
