import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  assignAgencyToQuestion,
  changeAdminIsOpen,
} from '@/actions/userServices';
import NewUpdateIcon from '@/icons/new';
import { Question } from '@/types/types';
import AgencyListDropdownOnCard from './AgencyListDropdownOnCard';
import ModalQuestionCard from './ModalQuestionCard';
import ThreeDottedMarkAsSpam from './ThreeDottedMarkAsSpam';
import SpamUpdateIcon from '@/icons/spam';
import { useSearchParams } from 'next/navigation';
import ThreeDottedMarkAsUnSpam from './ThreeDottedMarkAsUnSpam';
import ToastQuestionMarkAsSpam from './ToastQuestionMarkAsSpam';
import ToastQuestionMarkAsUnSpam from './ToastQuestionMarkAsUnSpam';

interface QuestionCardProps {
  question: Question;
  activeQuestionId: number | null;
  setactiveQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
  agencyMap: Record<string, string>;
}

const AdminQuestionCard: React.FC<QuestionCardProps> = ({
  question,
  activeQuestionId,
  setactiveQuestionId,
  agencyMap,
}) => {
  const t = useTranslations('Agency');
  const [selectedAgency, setSelectedAgency] = useState<string>('Unassigned');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSpamToast, setShowSpamToast] = useState(false);
  const [showUnSpamToast, setShowUnSpamToast] = useState(false);

  useEffect(() => {
    if (question.agency !== null) {
      const agencyAcronym = Object.keys(agencyMap).find(
        key => agencyMap[key] === question.agency!.toString(),
      );
      if (agencyAcronym) {
        setSelectedAgency(agencyAcronym);
      }
    }
  }, [question.agency, agencyMap]);

  const handleCardClick = async () => {
    setIsModalOpen(true);
    if (!question.admin_isopen) {
      try {
        await changeAdminIsOpen(question.id);
        question.admin_isopen = true;
      } catch (error) {
        console.error('Failed to change admin_isopen:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ', ' +
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const handleMarkAsSpamToast = () => {
    setShowSpamToast(true);
  };

  const handleUnSpamToast = () => {
    setShowUnSpamToast(true);
  };

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

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
            {question.state === 'spam' && (
              <div className="w-16 h-8 items-center justify-center flex">
                <SpamUpdateIcon
                  classNamePath="fill-[#FEF2F2] dark:fill-[#2B0707]"
                  classNameCircle="fill-[#DC2626] dark:fill-[#FF5959]"
                  classNamePath2="fill-[#DC2626] dark:fill-[#FF5959]"
                ></SpamUpdateIcon>
              </div>
            )}
            {question.admin_isopen === false && question.state !== 'spam' && (
              <div className="w-16 h-8 items-center justify-center flex">
                <NewUpdateIcon
                  classNamePath="fill-[#F0FDF4] dark:fill-[#052E16]"
                  classNameCircle="fill-[#15803D] dark:fill-[#16A34A]"
                  classNamePath2="fill-[#15803D] dark:fill-[#16A34A]"
                />
              </div>
            )}
            {question.admin_isopen === true && question.state !== 'spam' && (
              <div className="h-[22px] w-[55px]"></div>
            )}
          </div>
          <div className="relative pl-3">
            <AgencyListDropdownOnCard
              selectedAgency={selectedAgency}
              setSelectedAgency={setSelectedAgency}
              AGENCY_TO_UUID={agencyMap}
              setSuccessMessage={setSuccessMessage}
              activeQuestionId={activeQuestionId}
              setactiveQuestionId={setactiveQuestionId}
              questionId={question.id}
            />
          </div>
          <div className="font-normal text-sm text-dim-500 w-[180px] pl-3 ">
            {formatDate(question.date)}
          </div>
          <div>
            {activeTab === 'spam' ? (
              <ThreeDottedMarkAsUnSpam
                handleUnSpamToast={handleUnSpamToast}
                question={question}
              ></ThreeDottedMarkAsUnSpam>
            ) : (
              <ThreeDottedMarkAsSpam
                handleMarkAsSpamToast={handleMarkAsSpamToast}
                question={question}
              ></ThreeDottedMarkAsSpam>
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
      />
      {showSpamToast && (
        <ToastQuestionMarkAsSpam
          message="Question marked as spam"
          show={showSpamToast}
          onClose={() => setShowSpamToast(false)}
        />
      )}
      {showUnSpamToast && (
        <ToastQuestionMarkAsUnSpam
          message="Question marked as not spam"
          show={showUnSpamToast}
          onClose={() => setShowUnSpamToast(false)}
        />
      )}
    </>
  );
};

export default AdminQuestionCard;
